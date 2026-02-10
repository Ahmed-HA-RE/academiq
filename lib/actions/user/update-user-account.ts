'use server';

import { UpdateAccountDetails, UpdateAccountPassword } from '@/types';
import {
  updateAccountDetailsSchema,
  updateAccountPasswordSchema,
} from '@/schema';
import { prisma } from '@/lib/prisma';
import { getCurrentLoggedUser } from '../getUser';
import { UTApi } from 'uploadthing/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import ratelimit from '@/lib/redis';

export const updateAccountDetails = async (data: UpdateAccountDetails) => {
  try {
    const user = await getCurrentLoggedUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const validatedData = updateAccountDetailsSchema.safeParse(data);

    if (!validatedData.success) {
      throw new Error('Invalid data');
    }

    // if rate limit exceeded, throw error
    const identifier = user.id;
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      throw new Error('Too many requests. Please try again later.');
    }

    // Check if user changed his image then delete the previous one from uploadthing
    if (data.imageKey && user.imageKey && data.imageKey !== user.imageKey) {
      const utapi = new UTApi();
      await utapi.deleteFiles(user.imageKey);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: validatedData.data,
    });

    return {
      success: true,
      message: 'Updated successfully.',
    };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const updateAccountPassword = async (data: UpdateAccountPassword) => {
  try {
    const user = await getCurrentLoggedUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const validatedData = updateAccountPasswordSchema.safeParse(data);

    if (!validatedData.success) {
      throw new Error('Invalid data');
    }

    await auth.api.changePassword({
      body: {
        newPassword: validatedData.data.newPassword,
        currentPassword: validatedData.data.currentPassword,
        revokeOtherSessions: true,
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: 'Password updated successfully.',
    };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
