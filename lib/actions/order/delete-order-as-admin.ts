'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getOrderById } from './get-orders';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

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
          disconnect: order.orderItem.map((item) => ({ id: item.courseId })),
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
