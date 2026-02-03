'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

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
