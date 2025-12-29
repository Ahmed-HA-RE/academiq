import stripe from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import resend, { domain } from '@/lib/resend';
import SendReceipt from '@/emails/SendReceipt';
import { APP_NAME } from '@/lib/constants';
import { BillingInfo, OrderItems, PaymentResult } from '@/types';
import { formatDate } from '@/lib/utils';
import RefundOrder from '@/emails/RefundOrder';

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
      (error as Error).message
    );
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: session.metadata?.orderId },
        data: {
          isPaid: true,
          paidAt: new Date(),
          status: session.payment_status,
          paymentResult: {
            id: session.id,
            currency: session.currency,
            country: session.customer_details?.address?.country,
            amount: session.amount_total! / 100,
            paymentIntentId: session.payment_intent as string,
          },
        },
        include: {
          orderItems: true,
          user: true,
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
      (item) => item.courseId
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
    return Response.json('Refund processed successfully', { status: 200 });
  } else if (event.type === 'refund.updated') {
    const refund = event.data.object;

    const refundedOrder = await prisma.order.findFirst({
      where: { id: refund.metadata?.orderId },
      include: { user: true },
    });

    if (!refundedOrder) {
      return Response.json('Order not found', { status: 404 });
    }

    // Add later send email notification for the related instructor

    await resend.emails.send({
      from: `${APP_NAME} <support@${domain}>`,
      to: refundedOrder.user.email,
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
