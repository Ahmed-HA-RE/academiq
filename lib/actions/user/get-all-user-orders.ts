'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentLoggedUser } from '../getUser';
import { convertToPlainObject } from '@/lib/utils';

export const getAllUserOrders = async () => {
  const user = await getCurrentLoggedUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Fetch all orders for the authenticated user
  const orders = await prisma.order.findMany({
    where: {
      userId: user.id,
    },
    include: {
      orderItems: true, // Include related order items
      user: {
        select: { stripeCustomerId: true },
      },
      discount: true,
    },
    orderBy: {
      createdAt: 'desc', // Order by creation date, newest first
    },
  });

  return convertToPlainObject(orders);
};
