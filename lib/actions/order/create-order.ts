'use server';

import { revalidatePath } from 'next/cache';
import { createPaymentIntent } from '../../actions/stripe.action';
import { prisma } from '../../prisma';
import { headers } from 'next/headers';
import { auth } from '../../auth';
import { BillingInfo, Cart } from '@/types';
import { orderBaseSchema, orderItemSchema } from '@/schema';
import z from 'zod';

export const createOrder = async ({
  data,
  billingDetails,
}: {
  data: Cart;
  billingDetails: BillingInfo;
}) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error('User not authenticated');
    }

    if (!session.user.emailVerified)
      throw new Error('Please verify your email to proceed with the order');

    const validateOrderItems = z
      .array(orderItemSchema)
      .safeParse(data.cartItems);

    if (!validateOrderItems.success) throw new Error('Invalid order items');

    const validateOrderData = orderBaseSchema.safeParse({
      userId: session.user.id,
      itemsPrice: data.itemsPrice,
      taxPrice: data.taxPrice,
      totalPrice: data.totalPrice,
      discountId: data.discountId,
      billingDetails: billingDetails,
    });

    if (!validateOrderData.success) throw new Error('Invalid order data');

    const orderId = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: { ...validateOrderData.data },
      });

      await tx.orderItems.createMany({
        data: validateOrderItems.data.map((item) => ({
          courseId: item.courseId,
          name: item.name,
          image: item.image,
          price: item.price,
          orderId: order.id,
        })),
      });

      await tx.user.update({
        where: { id: validateOrderData.data.userId },
        data: {
          billingInfo: validateOrderData.data.billingDetails,
        },
      });

      return order.id;
    });

    // Create payment intent
    const paymentIntent = await createPaymentIntent(orderId);

    await prisma.order.update({
      where: { id: orderId },
      data: {
        stripePaymentIntentId: paymentIntent,
      },
    });

    revalidatePath('/checkout', 'page');
    return {
      success: true,
      message: 'Order created successfully.',
      redirectUrl: `/order/${orderId}/checkout`,
    };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
