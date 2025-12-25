import stripe from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import resend from '@/lib/resend';
import SendReceipt from '@/emails/SendReceipt';
import { APP_NAME } from '@/lib/constants';
import { BillingInfo, OrderItems, PaymentResult } from '@/types';

export const POST = async (req: Request) => {
  let event;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
  const signature = req.headers.get('stripe-signature') as string;
  const payload = await req.text();
  const domain = process.env.RESEND_DOMAIN;

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
            payerEmail: session.metadata?.payerEmail,
            payerName: session.metadata?.payerName,
            country: session.customer_details?.address?.country,
            amount: session.amount_total! / 100,
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
      from: `${APP_NAME} <noreply@${domain}>`,
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
  }
  return Response.json({ received: true });
};
