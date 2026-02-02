'use server';

import { UpdateAccountDetails } from '@/types';
import { updateAccountDetailsSchema } from '@/schema';
import { prisma } from '@/lib/prisma';
import { getCurrentLoggedUser } from '../getUser';
import { UTApi } from 'uploadthing/server';

export const updateAccountDetails = async (data: UpdateAccountDetails) => {
  try {
    const user = await getCurrentLoggedUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const validatedData = updateAccountDetailsSchema.safeParse(data);

    if (!validatedData.success) {
      console.log('Errors', validatedData.error);
      throw new Error('Invalid data');
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
