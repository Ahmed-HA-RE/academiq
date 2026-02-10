import stripe from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import resend, { domain } from '@/lib/resend';
import SendReceipt from '@/emails/SendReceipt';
import { APP_NAME } from '@/lib/constants';
import { OrderItem, PaymentResult } from '@/types';
import { formatDate } from '@/lib/utils';
import RefundOrder from '@/emails/RefundOrder';
import { revalidatePath } from 'next/cache';
import InstructorOrderRefund from '@/emails/InstructorOrderRefund';
import { knock } from '@/lib/knock';
import {
  sendInstructorCoursePurchaseNotification,
  sendInstructorRefundNotification,
  sendUserCoursePurchaseNotification,
  sendUserRefundNotification,
} from '@/lib/actions/notifications';

export const POST = async (req: Request) => {
  let event;
  const endpointSecret =
    process.env.NODE_ENV === 'production'
      ? (process.env.STRIPE_WEBHOOK_SECRET_PROD as string)
      : (process.env.STRIPE_WEBHOOK_SECRET_DEV as string);
  const signature = req.headers.get('stripe-signature') as string;
  const payload = await req.text();

  try {
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (error) {
    console.log(
      'Webhook signature verification failed.',
      (error as Error).message,
    );
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const courseId = session.metadata?.courseId;
    const userId = session.metadata?.userId;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { instructor: { include: { user: true } } },
    });

    if (!courseId || !userId) {
      console.error('Missing courseId or userId in session metadata');
      return new Response('Missing courseId or userId in session metadata', {
        status: 400,
      });
    }
    if (!course) {
      console.error('Course not found for ID:', courseId);
      return new Response('Course not found', { status: 404 });
    }

    const newOrder = await prisma.order.create({
      data: {
        userId: userId,
        coursePrice: (session.amount_total as number) / 100,
        totalPrice: (session.amount_total as number) / 100,
        taxPrice: (session.total_details?.amount_tax as number) / 100,
        paidAt: new Date(),
        status: 'paid',
        isPaid: true,
        stripePaymentIntentId: session.payment_intent as string,
        paymentResult: {
          id: session.id,
          currency: session.currency,
          amount: (session.amount_total as number) / 100,
          invoiceId: session.invoice as string,
        },
        orderItem: {
          create: {
            courseId,
            name: course.title,
            price: (session.amount_total as number) / 100,
            image: course.image,
          },
        },
      },
      include: { user: true, orderItem: { include: { course: true } } },
    });

    // Connect course to user to give him access and create user progress
    await prisma.user.update({
      where: { id: userId },
      data: {
        courses: {
          connect: { id: courseId },
        },
      },
    });

    await sendInstructorCoursePurchaseNotification(userId, course.title);

    await prisma.userProgress.create({
      data: {
        userId,
        courseId,
      },
    });

    await resend.emails.send({
      from: `${APP_NAME} <no-reply@${domain}>`,
      to: newOrder.user.email,
      subject: `Your receipt from ${APP_NAME}`,
      react: SendReceipt({
        order: {
          ...newOrder,
          orderItem: newOrder.orderItem as OrderItem[],
          paymentResult: newOrder.paymentResult as PaymentResult,
        },
        customerEmail: newOrder.user.email,
      }),
    });

    await sendUserCoursePurchaseNotification(userId, course.title);

    return Response.json({ message: 'Charge succeeded processed' });
    // Create a refund process for an order
  } else if (event.type === 'refund.updated') {
    const refund = event.data.object;

    const refundedOrder = await prisma.order.update({
      where: { id: refund.metadata?.orderId },
      data: {
        status:
          refund.status === 'succeeded'
            ? 'refunded'
            : refund.status === 'failed'
              ? 'paid'
              : 'pending_refund',
      },
      include: { user: true, orderItem: { include: { course: true } } },
    });

    // Remove user access to the refunded courses
    const itemsCourseId = refundedOrder.orderItem.map((item) => item.courseId);
    await prisma.user.update({
      where: {
        id: refundedOrder.userId,
      },
      data: {
        courses: {
          disconnect: itemsCourseId.map((courseId) => ({ id: courseId })),
        },
      },
    });

    // Delete user progress for the refunded courses
    await prisma.userProgress.deleteMany({
      where: {
        userId: refundedOrder.userId,
        courseId: {
          in: refundedOrder.orderItem.map((item) => item.courseId),
        },
      },
    });

    const instructor = await prisma.instructor.findFirst({
      where: { id: refundedOrder.orderItem[0].course.instructorId },
      include: {
        user: { select: { email: true, name: true, banned: true } },
      },
    });

    const item = refundedOrder.orderItem[0];
    if (instructor && !instructor.user.banned) {
      // Notify instructor about the refund
      await resend.emails.send({
        from: `${APP_NAME} <support@${domain}>`,
        to: instructor.user.email,
        subject: 'A refund has been processed for your course',
        react: InstructorOrderRefund({
          courseName: item.course.title,
          instructorName: instructor.user.name,
          refundAmount: Number(item.price),
        }),
      });
      // Notify instructor about the refund
      await sendInstructorRefundNotification(
        refund.amount / 100,
        instructor.userId as string,
      );
    }

    await resend.emails.send({
      from: `${APP_NAME} <support@${domain}>`,
      to: refundedOrder.user.email,
      replyTo: process.env.REPLY_EMAIL,
      subject: 'Your order has been refunded',
      react: RefundOrder({
        name: refundedOrder.user.name,
        orderId: refundedOrder.id,
        refundAmount: (refund.amount / 100).toFixed(2),
        refundDate: formatDate(new Date(refund.created * 1000), 'date'),
      }),
    });

    await sendUserRefundNotification(
      refundedOrder.userId as string,
      item.course.title,
    );

    revalidatePath('/account', 'page');
    revalidatePath('/admin-dashboard/orders', 'page');

    return Response.json({ message: 'Charge refunded processed' });
  }
  return Response.json({ received: true });
};
