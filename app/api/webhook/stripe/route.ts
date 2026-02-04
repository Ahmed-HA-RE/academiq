import stripe from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import resend, { domain } from '@/lib/resend';
import SendReceipt from '@/emails/SendReceipt';
import { APP_NAME, APPLICATION_FEE_PERCENTAGE } from '@/lib/constants';
import { BillingInfo, OrderItems, PaymentResult } from '@/types';
import { convertToFils, formatDate } from '@/lib/utils';
import RefundOrder from '@/emails/RefundOrder';
import { revalidatePath } from 'next/cache';
import InstructorOrderRefund from '@/emails/InstructorOrderRefund';

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

  if (event.type === 'charge.succeeded') {
    const session = event.data.object;

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: session.metadata.orderId },
        data: {
          isPaid: true,
          paidAt: new Date(),
          status: session.status === 'succeeded' ? 'paid' : 'unpaid',
          paymentResult: {
            id: session.id,
            currency: session.currency,
            amount: session.amount / 100,
          },
        },
        include: {
          user: true,
          orderItems: true,
          discount: true,
        },
      });

      await tx.user.update({
        where: { id: order.user.id },
        data: {
          courses: {
            connect: order.orderItems.map((item) => ({
              id: item.courseId,
            })),
          },
        },
      });

      await tx.cart.deleteMany({ where: { id: session.metadata?.cartId } });

      return order;
    });

    const progressionData = [];

    // Transfer instructors their share and save transfer ids
    for (const item of updatedOrder.orderItems) {
      const course = await prisma.course.findUnique({
        where: { id: item.courseId },
        select: {
          instructor: { include: { user: { select: { banned: true } } } },
        },
      });

      if (course?.instructor.user.banned || !item.payoutsEnabled) {
        continue;
      }

      if (course?.instructor.stripeAccountId) {
        const transfer = await stripe.transfers.create({
          currency: 'aed',
          amount: Math.round(
            (convertToFils(item.price) * (100 - APPLICATION_FEE_PERCENTAGE)) /
              100,
          ), // 5% application fee
          destination: course?.instructor.stripeAccountId as string,
          source_transaction: session.id,
        });
        // Save transfer id in db
        await prisma.orderItems.update({
          where: { id_courseId: { id: item.id, courseId: item.courseId } },
          data: {
            stripeTransferId: transfer.id,
          },
        });
      }
      progressionData.push({
        userId: updatedOrder.userId,
        courseId: item.courseId,
      });
    }
    await prisma.userProgress.createMany({
      data: progressionData,
    });

    await resend.emails.send({
      from: `${APP_NAME} <no-reply@${domain}>`,
      to: updatedOrder.user.email,
      subject: `Your receipt from ${APP_NAME}`,
      react: SendReceipt({
        order: {
          ...updatedOrder,
          orderItems: updatedOrder.orderItems as OrderItems[],
          billingDetails: updatedOrder.billingDetails as BillingInfo,
          paymentResult: updatedOrder.paymentResult as PaymentResult,
        },
        discount: updatedOrder.discount,
      }),
    });

    return Response.json({ message: 'Charge succeeded processed' });
    // Create a refund process for an order
  } else if (event.type === 'charge.refunded') {
    const refund = event.data.object;

    const refundedOrder = await prisma.order.update({
      where: { id: refund.metadata?.orderId },
      data: { status: 'refunded' },
      include: { user: true, orderItems: { include: { course: true } } },
    });

    // Remove user access to the refunded courses
    const itemsCourseIds = refundedOrder.orderItems.map(
      (item) => item.courseId,
    );
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

    for (const item of refundedOrder.orderItems) {
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

    revalidatePath('/admin-dashboard', 'layout');
    return Response.json({ message: 'Charge refunded processed' });
  } else if (event.type === 'coupon.created') {
    const coupon = event.data.object;

    const discount = await prisma.discount.findFirst({
      where: { id: coupon.metadata?.discountId as string },
    });

    if (!discount) {
      console.log('Discount not found for coupon creation');
    }

    await prisma.discount.update({
      where: { id: discount?.id },
      data: {
        stripeCouponId: coupon.id,
      },
    });
    return Response.json({ message: 'Coupon created processed' });
  }
  return Response.json({ received: true });
};
