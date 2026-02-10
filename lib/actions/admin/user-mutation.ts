'use server';

import { auth } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';
import { updateUserAsAdminSchema } from '@/schema';
import { UpdateUserAsAdmin } from '@/types';
import stripe from '@/lib/stripe';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export const banAsAdmin = async (id: string, role: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin')
      throw new Error('Unauthorized to ban users');

    const user = await prisma.user.findUnique({
      where: { id },
      include: { instructor: true },
    });

    if (!user) throw new Error('User not found');

    if (user.banned) throw new Error('User is already banned');

    await auth.api.banUser({
      body: {
        userId: user.id,
        banReason: 'Violation of terms of service',
      },
      headers: await headers(),
    });

    // If the user is an instructor, set their courses to unpublished
    if (user.role === 'instructor' && user.instructor) {
      await prisma.course.updateMany({
        where: { instructorId: user.instructor.id },
        data: { published: false },
      });

      // Disable instructor stripe's account payments and transfers
      await stripe.accounts.update(user.instructor.stripeAccountId, {
        settings: {
          payouts: {
            schedule: {
              interval: 'manual', // Disable automatic payouts
            },
          },
        },
      });

      // Refund all users that purchased courses from the banned instructor

      const orders = await prisma.order.findMany({
        where: {
          orderItem: {
            some: {
              course: {
                instructorId: user.instructor.id,
              },
            },
          },
        },
      });

      for await (const order of orders) {
        await stripe.refunds.create({
          payment_intent: order.stripePaymentIntentId as string,
          metadata: {
            orderId: order.id,
          },
          reverse_transfer: true,
          refund_application_fee: true,
          amount: Math.round(Number(order.paymentResult?.amount) * 100),
        });

        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'pending_refund' },
        });
      }
    }

    revalidatePath('/admin-dashboard/instructors', 'page');
    revalidatePath('/admin-dashboard/users', 'page');
    return { success: true, message: `${role} banned successfully` };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const deleteUserById = async (userId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin')
      throw new Error('Unauthorized to delete users');

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        orders: {
          none: {},
        },
      },
    });

    if (!user) throw new Error('User not found');

    if (user.id === session.user.id)
      throw new Error('Admin users cannot delete themselves');

    if (user.role === 'admin') throw new Error('Cannot delete admin users');

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    revalidatePath('/', 'layout');
    return { success: true, message: 'User deleted successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const deleteSelectedUsers = async (userIds: string[]) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin')
      throw new Error('Unauthorized to delete users');

    await prisma.user.deleteMany({
      where: { id: { in: userIds }, orders: { none: {} } },
    });
    revalidatePath('/', 'layout');
    return { success: true, message: 'Users deleted successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const updateUserAsAdmin = async (
  userId: string,
  data: UpdateUserAsAdmin,
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin')
      throw new Error('Unauthorized to update users');

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error('User not found');

    const validatedData = updateUserAsAdminSchema.safeParse(data);

    if (!validatedData.success) throw new Error('Invalid data');

    // Banned users cannot be assigned admin role
    if (user.banned && validatedData.data.role === 'admin')
      throw new Error('Banned users cannot be assigned to admin role');

    // Unverified users cannot be assigned admin role
    if (!user.emailVerified && validatedData.data.role === 'admin')
      throw new Error('Unverified users cannot be assigned to admin role');

    // Unauthorized to update users with admin role
    if (
      user.role === 'admin' &&
      session.user.id !== user.id &&
      validatedData.data.role === 'admin'
    )
      throw new Error('Cannot update admin users');

    // Upload new avatar if provided to cloudinary
    let avatarUrl;

    if (validatedData.data.avatar) {
      avatarUrl = await uploadToCloudinary(
        validatedData.data.avatar,
        'avatars',
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: validatedData.data.name,
        email: validatedData.data.email,
        role: validatedData.data.role,
        emailVerified: validatedData.data.status === 'verified' ? true : false,
        image: avatarUrl?.secure_url || user.image,
      },
    });

    revalidatePath('/', 'layout');
    return { success: true, message: 'User updated successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
