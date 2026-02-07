'use server';
import { auth } from '../../auth';
import { headers } from 'next/headers';
import { prisma } from '../../prisma';
import { PaymentResult } from '@/types';
import { convertToPlainObject } from '../../utils';
import { Prisma } from '../../generated/prisma/client';
import { endOfDay, startOfDay } from 'date-fns';

export const getOrderById = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItem: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!order) return undefined;
  return convertToPlainObject({
    ...order,
    paymentResult: order?.paymentResult as PaymentResult,
  });
};

// Get total orders count
export const getOrdersCount = async () => {
  const count = await prisma.order.count();
  return count;
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
    include: { orderItem: true },
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
        paymentResult: order.paymentResult as PaymentResult,
      }),
    ),
    totalPages,
  };
};
