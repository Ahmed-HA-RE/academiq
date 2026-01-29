'use server';

import { notFound } from 'next/navigation';
import { auth } from '../auth';
import { headers } from 'next/headers';
import { prisma } from '../prisma';
import { convertToPlainObject } from '../utils';
import { BillingInfo } from '@/types';

export const getCurrentLoggedUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return undefined;

  const user = await prisma.user.findFirst({
    where: { id: session?.user.id },
    include: {
      courses: {
        select: {
          id: true,
          title: true,
          image: true,
        },
      },
    },
  });

  if (!user) return notFound();

  return convertToPlainObject({
    ...user,
    billingInfo: user.billingInfo as BillingInfo,
  });
};

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return undefined;

  return convertToPlainObject({
    ...user,
    billingInfo: user.billingInfo as BillingInfo,
  });
};
