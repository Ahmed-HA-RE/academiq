import stripe from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

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

    await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: session.metadata?.orderId },
        data: {
          isPaid: true,
          paidAt: new Date(),
          status: session.payment_status,
          paymentResult: {
            id: session.id,
            email: session.customer_email,
            country: session.customer_details?.address?.country,
            amount: session.amount_total! / 100,
          },
        },
        include: {
          orderItems: true,
          user: true,
        },
      });

      await tx.user.update({
        where: { id: updatedOrder.user.id },
        data: {
          courses: {
            connect: updatedOrder.orderItems.map((item) => ({
              id: item.courseId,
            })),
          },
        },
      });

      await tx.cart.deleteMany({ where: { id: session.metadata?.cartId } });
    });
  }
  return Response.json({ received: true });
};
