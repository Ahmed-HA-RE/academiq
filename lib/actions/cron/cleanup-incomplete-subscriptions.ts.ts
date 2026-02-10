'use server';

import { prisma } from '@/lib/prisma';
import { addDays } from 'date-fns';

export const cleanupIncompleteSubscriptions = async () => {
  const tommorrow = addDays(new Date(), 1);

  await prisma.subscription.deleteMany({
    where: {
      status: { in: ['incomplete', 'incomplete_expired'] },
      createdAt: { lt: tommorrow },
    },
  });
};
