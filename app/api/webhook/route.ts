import stripe from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import resend, { domain } from '@/lib/resend';
import SendReceipt from '@/emails/SendReceipt';
import { APP_NAME, APPLICATION_FEE_PERCENTAGE } from '@/lib/constants';
import { BillingInfo, OrderItems, PaymentResult } from '@/types';
import { formatDate } from '@/lib/utils';
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

  if (event.type === 'payment_intent.succeeded') {
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
            amount: session.amount_received / 100,
          },
        },
        include: {
          user: true,
          orderItems: true,
          discount: true,
        },
      });

      // Transfer credits to instrcutors and enroll user to purchased courses
      for (const item of order.orderItems) {
        const course = await tx.course.findUnique({
          where: { id: item.courseId },
          include: { instructor: true },
        });

        if (course) {
          const instructorEarnings =
            Number(item.price) * (1 - APPLICATION_FEE_PERCENTAGE); // Assuming 5% platform fee
          await stripe.transfers.create({
            currency: 'aed',
            amount: Math.round(instructorEarnings * 100),
            destination: course.instructor.stripeAccountId,
          });
        }
      }
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
    return Response.json({ received: true });

    // Create a refund process for an order
  } else if (event.type === 'refund.created') {
    const refund = event.data.object;

    const refundedOrder = await prisma.order.update({
      where: { id: refund.metadata?.orderId },
      data: { status: 'refunded' },
      include: { user: true, orderItems: true },
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

    revalidatePath('/admin-dashboard', 'layout');

    return Response.json('Refund processed successfully', { status: 200 });
  } else if (event.type === 'refund.updated') {
    const refund = event.data.object;

    const refundedOrder = await prisma.order.findFirst({
      where: { id: refund.metadata?.orderId },
      include: {
        user: true,
        orderItems: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!refundedOrder) {
      return Response.json('Order not found', { status: 404 });
    }

    for (const item of refundedOrder.orderItems) {
      // Find the related instructor email and send notification
      const instructor = await prisma.instructor.findFirst({
        where: { id: item.course.instructorId },
        include: {
          user: { select: { email: true, name: true, banned: true } },
        },
      });

      if (!instructor) {
        return Response.json('Instructor not found', { status: 404 });
      }

      if (instructor.user.banned) {
        continue;
      }

      await resend.emails.send({
        from: `${APP_NAME} <support@${domain}>`,
        to: instructor.user.email,
        subject: 'A refund has been processed for your course',
        react: InstructorOrderRefund({
          coursesName: refundedOrder.orderItems.map(
            (item) => item.course.title,
          ),
          instructorName: instructor.user.name,
          refundAmount: refund.amount / 100,
        }),
      });
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
        refundCode: refund.destination_details?.card?.reference as string,
      }),
    });
    return Response.json('Refund update email sent', { status: 200 });
  } else if (event.type === 'coupon.created') {
    const coupon = event.data.object;

    const discount = await prisma.discount.findFirst({
      where: { id: coupon.metadata?.discountId as string },
    });

    if (!discount) {
      return Response.json('Discount not found', { status: 404 });
    }

    await prisma.discount.update({
      where: { id: discount.id },
      data: {
        stripeCouponId: coupon.id,
      },
    });

    return Response.json('Coupon id added successfully', { status: 200 });
  }
};
