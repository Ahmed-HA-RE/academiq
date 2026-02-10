'use server';

import { headers } from 'next/headers';
import { auth } from '../../auth';
import { getOrderById } from '../../actions/order/get-orders';
import { prisma } from '../../prisma';
import stripe from '../../stripe';

// Create a refund process for an order
export const createRefund = async (orderId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session)
      throw new Error('Unauthorized to perform the requested action');

    const order = await getOrderById(orderId);

    if (!order) throw new Error('Order not found');

    if (!order.isPaid || !order.paymentResult)
      throw new Error('Cannot refund an unpaid order');

    if (
      order.paidAt &&
      order.paidAt <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 30 days
    )
      throw new Error('Refund period has expired');

    if (order.status === 'refunded')
      throw new Error('Order has already been refunded');

    const userCourseProgress = await prisma.userProgress.findFirst({
      where: {
        userId: order.userId,
        courseId: {
          in: order.orderItem.map((item) => item.courseId),
        },
      },
    });

    if (userCourseProgress && Number(userCourseProgress.progress) >= 10)
      throw new Error(
        'An order cannot be refunded if the course progress is more than 10%',
      );

    await stripe.refunds.create({
      payment_intent: order.stripePaymentIntentId as string,
      metadata: {
        orderId: order.id,
      },
      reverse_transfer: true,
      refund_application_fee: true,
      amount: Math.round(Number(order.paymentResult.amount) * 100),
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'pending_refund' },
    });

    return { success: true, message: 'Refund requested successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
