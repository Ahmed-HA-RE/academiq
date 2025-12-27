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
import { convertToPlainObject } from '../utils';
import { Prisma } from '../generated/prisma';
import { endOfDay, startOfDay } from 'date-fns';

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
        customer_email: billingDetails.email,
        mode: 'payment',
        metadata: {
          orderId: order.id,
          cartId: data.id,
          payerName: billingDetails.fullName,
          payerEmail: billingDetails.email,
        },
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
    where: {
      isPaid: true,
    },
  });
  return totalSales._sum.totalPrice || 0;
};

export const getMonthlyRevenue = async () => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  const orders = await prisma.order.findMany({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(`${previousYear}-01-01`),
        lte: new Date(`${currentYear}-12-31`),
      },
    },
    select: {
      totalPrice: true,
      createdAt: true,
    },
  });

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2024, i).toLocaleString('default', {
      month: 'long',
    });
    const currentYearRevenue = orders
      .filter(
        (order) =>
          order.createdAt.getMonth() === i &&
          order.createdAt.getFullYear() === currentYear
      )
      .reduce((sum, order) => sum + Number(order.totalPrice), 0);

    const previousYearRevenue = orders
      .filter(
        (order) =>
          order.createdAt.getMonth() === i &&
          order.createdAt.getFullYear() === previousYear
      )
      .reduce((sum, order) => sum + Number(order.totalPrice), 0);

    return {
      name: month,
      pv: Math.round(currentYearRevenue / 100),
      uv: Math.round(previousYearRevenue / 100),
      amt: Math.round(currentYearRevenue / 100),
    };
  });

  return monthlyData;
};

export const getTotalRevenueAfter = async () => {
  const currentYear = new Date().getFullYear();

  const totalRevenue = await prisma.order.aggregate({
    _sum: { totalPrice: true },
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(`${currentYear}`),
      },
    },
  });
  return Number(totalRevenue._sum.totalPrice) || 0;
};
export const getTotalRevenueBefore = async () => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  const totalRevenue = await prisma.order.aggregate({
    _sum: { totalPrice: true },
    where: {
      isPaid: true,
      createdAt: {
        lte: new Date(`${previousYear}-12-31`),
      },
    },
  });
  return Number(totalRevenue._sum.totalPrice) || 0;
};

// Get orders monthly revenue
export const getOrdersMonthlyRevenue = async () => {
  const currentYear = new Date().getFullYear();

  const orders = await prisma.order.findMany({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(`${currentYear}-01-01`),
        lte: new Date(`${currentYear}-12-31`),
      },
    },
    select: {
      totalPrice: true,
      createdAt: true,
    },
  });

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthFull = new Date(currentYear, i).toLocaleString('default', {
      month: 'long',
    });
    const monthShort = monthFull.slice(0, 3);

    const monthRevenue = orders
      .filter((order) => order.createdAt.getMonth() === i)
      .reduce((sum, order) => sum + Number(order.totalPrice), 0);

    return {
      month: monthShort,
      revenue: Math.round(monthRevenue / 100),
      totalPrice: monthRevenue,
    };
  });

  return monthlyData;
};

// Get all orders
export const getAllOrdersAsAdmin = async ({
  q,
  status,
  paidAt,
  page = 1,
  limit = 10,
}: {
  q?: string;
  status?: string;
  page?: number;
  paidAt?: string;
  limit?: number;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin')
    throw new Error('Unauthorized to get the requested resource');

  // Filter query
  const filterQuery: Prisma.OrderWhereInput = q
    ? {
        OR: [
          { user: { name: { contains: q, mode: 'insensitive' } } },
          { user: { email: { contains: q, mode: 'insensitive' } } },
        ],
      }
    : {};

  // Status filter
  const statusFilter: Prisma.OrderWhereInput = status
    ? {
        status: status,
      }
    : {};

  // Paid At filter
  const paidAtFilter: Prisma.OrderWhereInput = paidAt
    ? {
        AND: [
          {
            paidAt: {
              gte: startOfDay(paidAt),
              lte: endOfDay(paidAt),
            },
          },
        ],
      }
    : {};

  const orders = await prisma.order.findMany({
    where: {
      ...filterQuery,
      ...statusFilter,
      ...paidAtFilter,
    },
    include: { orderItems: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  const totalOrders = await prisma.order.count({
    where: {
      ...filterQuery,
      ...statusFilter,
    },
  });

  const totalPages = Math.ceil(totalOrders / limit);

  return {
    orders: orders.map((order) =>
      convertToPlainObject({
        ...order,
        billingDetails: order.billingDetails as BillingInfo,
        paymentResult: order.paymentResult as PaymentResult,
      })
    ),
    totalPages,
  };
};

// Delete order by id as admin
export const deleteOrderByIdAsAdmin = async (orderId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin')
      throw new Error('Unauthorized to perform the requested action');

    await prisma.order.delete({
      where: { id: orderId },
    });

    revalidatePath('/', 'layout');

    return { success: true, message: 'Order deleted successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

// Mark order as expired by id as admin
export const markAsExpiredAndDeleteOrdersAsAdmin = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin')
      throw new Error('Unauthorized to perform the requested action');

    await prisma.order.updateMany({
      where: {
        AND: [
          { isPaid: false },
          {
            createdAt: {
              lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day
            },
          },
        ],
      },
      data: {
        status: 'expired',
      },
    });

    await prisma.order.deleteMany({
      where: { status: 'expired' },
    });

    revalidatePath('/admin-dashboard', 'layout');

    return {
      success: true,
      message: 'Some Orders marked as expired and deleted successfully',
    };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
