'use server';

import { notFound } from 'next/navigation';
import { auth } from '../auth';
import { headers } from 'next/headers';
import { prisma } from '../prisma';
import { convertToPlainObject } from '../utils';
import { BillingInfo } from '@/types';
import { Prisma } from '../generated/prisma';

export const getCurrentLoggedUser = async (search?: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return undefined;

  // Search Filter
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

// Get user's progress in courses
export const getUserProgress = async (courseId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return undefined;

  const progress = await prisma.userProgress.findFirst({
    where: { userId: session.user.id, courseId: courseId },
  });

  if (!progress) return undefined;
  return convertToPlainObject(progress);
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
