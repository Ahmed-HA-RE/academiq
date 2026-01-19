'use server';

import { auth } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';
import { updateUserAsAdminSchema } from '@/schema';
import { UpdateUserAsAdmin } from '@/types';
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
    });

    if (!user) throw new Error('User not found');

    await prisma.$transaction(async (tx) => {
      await auth.api.banUser({
        body: {
          userId: user.id,
          banReason: 'Violation of terms of service',
        },
        headers: await headers(),
      });
      await tx.user.update({
        where: { id: user.id },
        data: { role: 'user' },
      });
    });

    revalidatePath('/', 'layout');
    return { success: true, message: `${role} banned successfully` };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const unbanAsAdmin = async (id: string, role: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin')
      throw new Error('Unauthorized to ban users');

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new Error('User not found');

    await auth.api.unbanUser({
      body: {
        userId: user.id,
      },
      headers: await headers(),
    });
    revalidatePath('/', 'layout');
    return { success: true, message: `${role} unbanned successfully` };
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
      where: { id: userId },
    });

    if (!user) throw new Error('User not found');

    if (user.id === session.user.id)
      throw new Error('Admin users cannot delete themselves');

    if (user.role === 'admin') throw new Error('Cannot delete admin users');

    await prisma.user.delete({
      where: { id: userId },
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
      where: { id: { in: userIds } },
    });
    revalidatePath('/', 'layout');
    return { success: true, message: 'Users deleted successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const updateUserAsAdmin = async (
  userId: string,
  data: UpdateUserAsAdmin
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
        'avatars'
      );
    }

    const updatedBillingInfo = {
      phone: validatedData.data.phone === '' ? null : validatedData.data.phone,
      address:
        validatedData.data.address === '' ? null : validatedData.data.address,
      country:
        validatedData.data.country === '' ? null : validatedData.data.country,
      fullName:
        validatedData.data.fullName === '' ? null : validatedData.data.fullName,
    };

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: validatedData.data.name,
        email: validatedData.data.email,
        role: validatedData.data.role,
        emailVerified: validatedData.data.status === 'verified' ? true : false,
        image: avatarUrl?.secure_url || user.image,
        billingInfo: updatedBillingInfo,
      },
    });

    revalidatePath('/', 'layout');
    return { success: true, message: 'User updated successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
