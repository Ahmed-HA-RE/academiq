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

// Get total of new users that registered in the last 30 days
export const getNewUsersCount = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const count = await prisma.user.count({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
  });
  return count;
};

// Get total of active users
export const getActiveUsersCount = async () => {
  const activeUsers = await prisma.order.findMany({
    distinct: ['userId'],
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
  });
  return activeUsers.length;
};

// Get monthly user activity data for current year
export const getMonthlyUserActivity = async () => {
  const currentYear = new Date().getFullYear();

  // Get all users created this year
  const newUsers = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: new Date(`${currentYear}-01-01`),
        lte: new Date(`${currentYear}-12-31`),
      },
    },
    select: {
      createdAt: true,
    },
  });

  // Get all orders to determine active users by month
  const orders = await prisma.order.findMany({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(`${currentYear}-01-01`),
        lte: new Date(`${currentYear}-12-31`),
      },
    },
    select: {
      userId: true,
      createdAt: true,
    },
  });

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(currentYear, i).toLocaleString('default', {
      month: 'long',
    });

    // Count new users for this month
    const newUsersThisMonth = newUsers.filter(
      (user) => user.createdAt.getMonth() === i
    ).length;

    // Count unique active users (users who made purchases) for this month
    const activeUsersThisMonth = new Set(
      orders
        .filter((order) => order.createdAt.getMonth() === i)
        .map((order) => order.userId)
    ).size;

    return {
      name: month,
      pv: newUsersThisMonth,
      uv: activeUsersThisMonth,
      amt: activeUsersThisMonth,
    };
  });

  return monthlyData;
};

type GetAllUsersParams = {
  limit?: number;
  q?: string;
  role?: string;
  status?: string;
};

export const getAllUsers = async ({
  limit,
  q,
  role,
  status,
}: GetAllUsersParams) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin')
    throw new Error('Unauthorized');

  // Search filter
  const filterQuery: Prisma.UserWhereInput = q
    ? {
        OR: [
          {
            name: { contains: q, mode: 'insensitive' },
          },
          {
            email: { contains: q, mode: 'insensitive' },
          },
        ],
      }
    : {};

  // Role filter
  const roleFilter: Prisma.UserWhereInput = role
    ? {
        role: { equals: role },
      }
    : {};

  // Status filter
  const statusFilter: Prisma.UserWhereInput = status
    ? {
        emailVerified:
          status === 'verified' ? { not: false } : { equals: false },
      }
    : {};

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit || undefined,
    where: {
      ...filterQuery,
      ...roleFilter,
      ...statusFilter,
    },
  });

  return convertToPlainObject(
    users.map((user) => {
      return {
        ...user,
        billingInfo: user.billingInfo as BillingInfo,
      };
    })
  );
};
