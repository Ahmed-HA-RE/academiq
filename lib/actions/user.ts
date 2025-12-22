'use server';

import { notFound } from 'next/navigation';
import { auth } from '../auth';
import { headers } from 'next/headers';
import { prisma } from '../prisma';
import { convertToPlainObject } from '../utils';
import { BillingInfo } from '@/types';
import { Prisma } from '../generated/prisma';

export const getUserById = async (search?: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return undefined;

  // Seach Filter
  const searchFilter: Prisma.CourseWhereInput = search
    ? { title: { contains: search, mode: 'insensitive' } }
    : {};

  const user = await prisma.user.findFirst({
    where: { id: session?.user.id },
    include: {
      courses: {
        select: {
          id: true,
          title: true,
          slug: true,
          image: true,
        },
        where: { ...searchFilter },
      },
    },
  });

  if (!user) return notFound();

  return convertToPlainObject({
    ...user,
    billingInfo: user.billingInfo as BillingInfo,
  });
};

// Get users count
export const getUsersCount = async () => {
  const count = await prisma.user.count();
  return count;
};
