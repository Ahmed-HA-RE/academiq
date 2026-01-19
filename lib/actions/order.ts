'use server';
import { orderBaseSchema } from '@/schema';
import { auth } from '../auth';
import { headers } from 'next/headers';
import { prisma } from '../prisma';
import { BillingInfo, Cart, PaymentResult } from '@/types';
import { orderItemSchema } from '@/schema';
import z from 'zod';
import { stripe } from '../stripe';
import { revalidatePath } from 'next/cache';
import { convertToPlainObject } from '../utils';
import { Prisma } from '../generated/prisma';
import { endOfDay, startOfDay } from 'date-fns';
import { createPaymentIntent } from './stripe.action';

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

export const getOrderById = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: true,
      discount: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!order) return undefined;
  return convertToPlainObject({
    ...order,
    billingDetails: order?.billingDetails as BillingInfo,
    paymentResult: order?.paymentResult as PaymentResult,
  });
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

    // Const order before deletion
    const order = await getOrderById(orderId);

    if (!order) throw new Error('Order not found');

    // Remove user access to the courses in the deleted order if paid
    await prisma.user.update({
      where: {
        id: order.userId,
      },
      data: {
        courses: {
          disconnect: order.orderItems.map((item) => ({ id: item.courseId })),
        },
      },
    });
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
      order.paidAt <= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days
    )
      throw new Error('Refund period has expired');

    const userCourseProgress = await prisma.userProgress.findFirst({
      where: {
        userId: order.userId,
        courseId: {
          in: order.orderItems.map((item) => item.courseId),
        },
      },
    });

    if (userCourseProgress && +userCourseProgress.progress >= 10)
      throw new Error(
        'An order cannot be refunded if the course progress is more than 10%'
      );

    await stripe.refunds.create({
      payment_intent: order.paymentResult.id,
      metadata: {
        orderId: order.id,
      },
    });

    return { success: true, message: 'Order refunded successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
