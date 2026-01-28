'use server';

import { getCurrentLoggedUser } from '../getUser';
import { prisma } from '@/lib/prisma';

export const getUserRefundEligibility = async (userId: string) => {
  const currentUser = await getCurrentLoggedUser();

  if (!currentUser) {
    throw new Error('Unauthorized');
  }

  const progress = await prisma.userProgress.findFirst({
    where: {
      userId,
    },
  });

  return progress;
};
