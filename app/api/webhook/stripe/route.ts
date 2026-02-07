import stripe from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import resend, { domain } from '@/lib/resend';
import SendReceipt from '@/emails/SendReceipt';
import { APP_NAME, APPLICATION_FEE_PERCENTAGE } from '@/lib/constants';
import { OrderItem, PaymentResult } from '@/types';
import { convertToFils, formatDate } from '@/lib/utils';
import RefundOrder from '@/emails/RefundOrder';
import { revalidatePath } from 'next/cache';
import InstructorOrderRefund from '@/emails/InstructorOrderRefund';
import { knock } from '@/lib/knock';

export const POST = async (req: Request) => {
  let event;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
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

    if (!courseId || !userId) {
      console.error('Missing courseId or userId in session metadata');
      return new Response('Missing metadata', { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { instructor: { include: { user: true } } },
    });

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

    await knock.workflows.trigger('course-sold', {
      actor: 'academiq-support',
      recipients: [course.instructor.user.id as string],
      data: { courseName: course.title },
    });

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

    // Send notification to user about the new purchase
    await knock.workflows.trigger('purchase-course', {
      actor: 'academiq-support',
      recipients: [newOrder.userId],
      data: {
        courseName: newOrder.orderItem.map((item) => item.name),
      },
    });

    return Response.json({ message: 'Charge succeeded processed' });
    // Create a refund process for an order
  } else if (event.type === 'charge.refunded') {
    const refund = event.data.object;

    const refundedOrder = await prisma.order.update({
      where: { id: refund.metadata?.orderId },
      data: { status: 'refunded' },
      include: { user: true, orderItem: { include: { course: true } } },
    });

    // Remove user access to the refunded courses
    const itemsCourseIds = refundedOrder.orderItem.map((item) => item.courseId);
    await prisma.user.update({
      where: {
        id: refundedOrder.userId,
      },
      data: {
        courses: {
          disconnect: itemsCourseIds.map((courseId) => ({ id: courseId })),
        },
      },
    });

    const progressionData = [];

    for (const item of refundedOrder.orderItem) {
      const instructor = await prisma.instructor.findFirst({
        where: { id: item.course.instructorId },
        include: {
          user: { select: { email: true, name: true, banned: true } },
        },
      });

      if (!instructor || !item.payoutsEnabled) {
        continue;
      }

      if (!item.stripeTransferId) {
        continue;
      }

      // Find the related instructor email and send notification and refund his share
      await stripe.transfers.createReversal(item.stripeTransferId, {
        amount: Math.round(
          (convertToFils(item.price) * (100 - APPLICATION_FEE_PERCENTAGE)) /
            100,
        ),
      });

      if (instructor.user.banned) {
        continue;
      }

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
      progressionData.push({
        userId: refundedOrder.userId,
        courseId: item.courseId,
      });
    }

    await prisma.userProgress.deleteMany({
      where: {
        OR: progressionData.map((data) => ({
          userId: data.userId,
          courseId: data.courseId,
        })),
      },
    });

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

    revalidatePath('/account', 'page');
    revalidatePath('/admin-dashboard/orders', 'page');

    return Response.json({ message: 'Charge refunded processed' });
  }
  return Response.json({ received: true });
};
