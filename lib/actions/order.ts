'use server';
import { orderBaseSchema } from '@/schema';
import { auth } from '../auth';
import { headers } from 'next/headers';
import { prisma } from '../prisma';
import { BillingInfo, Cart, PaymentResult } from '@/types';
import { orderItemSchema } from '@/schema';
import z from 'zod';
import stripe from '../stripe';
import { SERVER_URL } from '../constants';
import { revalidatePath } from 'next/cache';

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
      billingDetails: billingDetails,
      discountId: data.discountId,
    });

    if (!validateOrderData.success) throw new Error('Invalid order data');

    const checkout = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: validateOrderData.data,
        include: {
          orderItems: true,
          discount: { select: { stripeCouponId: true } },
        },
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
        where: { id: session.user.id },
        data: {
          billingInfo: billingDetails,
        },
      });

      const checkoutSession = await stripe.checkout.sessions.create({
        discounts: data.discountId
          ? [
              {
                coupon: order.discount?.stripeCouponId,
              },
            ]
          : undefined,
        success_url: `${SERVER_URL}/success?orderId=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SERVER_URL}/checkout`,
        mode: 'payment',
        customer_email: validateOrderData.data.billingDetails.email,
        metadata: { orderId: order.id, cartId: data.id },
        line_items: validateOrderItems.data.map((item) => {
          const tax = 0.05;
          const priceWithTax = Number(item.price) * (1 + tax);
          return {
            price_data: {
              product_data: {
                name: item.name,
                images: [item.image],
              },
              currency: 'aed',
              unit_amount: Math.round(priceWithTax * 100),
            },
            quantity: 1,
          };
        }),
      });

      return checkoutSession.url;
    });
    revalidatePath('/', 'layout');
    return {
      success: true,
      redirect: checkout,
    };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const getOrderById = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: true,
      discount: true,
    },
  });

  if (!order) return undefined;
  return {
    ...order,
    billingDetails: order?.billingDetails as BillingInfo,
    paymentResult: order?.paymentResult as PaymentResult,
  };
};

// Get total orders count
export const getOrdersCount = async () => {
  const count = await prisma.order.count();
  return count;
};

// Get total sales amount
export const getTotalSalesAmount = async () => {
  const totalSales = await prisma.order.aggregate({
    _sum: {
      totalPrice: true,
    },
  });
  return totalSales._sum.totalPrice || 0;
};
