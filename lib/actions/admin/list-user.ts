'use server';

import { auth } from '@/lib/auth';
import { Prisma } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { convertToPlainObject } from '@/lib/utils';
import { BillingInfo } from '@/types';
import { headers } from 'next/headers';

export const getUsersCount = async () => {
  const count = await prisma.user.count();
  return count;
};

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

export const getActiveUsersCount = async () => {
  const activeUsers = await prisma.userProgress.findMany({
    distinct: ['userId'],
    where: {
      progress: { gt: 0 },
    },
  });

  return activeUsers.length;
};

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

  // Get all progress to determine active users by month
  const progress = await prisma.userProgress.findMany({
    where: {
      progress: { gt: 0 },
      updatedAt: {
        gte: new Date(`${currentYear}-01-01`),
        lte: new Date(`${currentYear}-12-31`),
      },
    },
    select: {
      userId: true,
      updatedAt: true,
    },
  });

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(currentYear, i).toLocaleString('default', {
      month: 'long',
    });

    // Count new users for this month
    const newUsersThisMonth = newUsers.filter(
      (user) => user.createdAt.getMonth() === i,
    ).length;

    // Count unique active users (users who made progress) for this month
    const activeUsersThisMonth = new Set(
      progress
        .filter((progress) => progress.updatedAt.getMonth() === i)
        .map((progress) => progress.userId),
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

export const getBannedUsers = async ({
  page,
  q,
  limit,
  status,
}: {
  limit?: number;
  q?: string;
  status?: string;
  page: number;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin')
    throw new Error('Unauthorized to view banned users');

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
        AND: { banned: true },
      }
    : { banned: true };

  // Status filter
  const statusFilter: Prisma.UserWhereInput = status
    ? {
        emailVerified:
          status === 'verified' ? { not: false } : { equals: false },
        AND: { banned: true },
      }
    : { banned: true };

  const bannedUsers = await prisma.user.findMany({
    where: { ...filterQuery, ...statusFilter },
    orderBy: { createdAt: 'desc' },
    take: limit || undefined,
    skip: (page - 1) * (limit || 0),
    include: {
      _count: {
        select: { orders: true },
      },
    },
  });
  const totalBannedUsers = await prisma.user.count({
    where: { ...filterQuery, ...statusFilter },
  });

  const totalPages = limit ? Math.ceil(totalBannedUsers / limit) : 1;

  return {
    users: convertToPlainObject(
      bannedUsers.map((user) => ({
        ...user,
        billingInfo: user.billingInfo as BillingInfo,
        ordersCount: user._count.orders,
      })),
    ),
    totalPages,
  };
};

export const getAllAdmins = async (
  q?: string,
  page: number = 1,
  limit = 10,
) => {
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
        AND: { role: 'admin', id: { not: session.user.id } },
      }
    : { role: 'admin', id: { not: session.user.id } };

  const admins = await prisma.user.findMany({
    where: { ...filterQuery },
    orderBy: { createdAt: 'desc' },
    take: limit || undefined,
    skip: (page - 1) * limit,
  });

  const totalAdmins = await prisma.user.count({
    where: { ...filterQuery },
  });

  const totalPages = Math.ceil(totalAdmins / limit);

  return {
    adminUsers: convertToPlainObject(
      admins.map((user) => ({
        ...user,
        billingInfo: user.billingInfo as BillingInfo,
      })),
    ),
    totalPages,
  };
};

type GetAllUsersParams = {
  limit?: number;
  q?: string;
  role?: string;
  status?: string;
  page: number;
};
export const getAllUsers = async ({
  limit,
  q,
  role,
  status,
  page = 1,
}: GetAllUsersParams) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin')
    throw new Error('Unauthorized');

  const baseFilter: Prisma.UserWhereInput = {
    NOT: [{ role: 'admin' }, { role: 'instructor' }],
    AND: [{ banned: false }],
  };

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
        ...baseFilter,
      }
    : {
        ...baseFilter,
      };

  // Role filter
  const roleFilter: Prisma.UserWhereInput = role
    ? {
        role: { equals: role },
        ...baseFilter,
      }
    : {
        ...baseFilter,
      };

  // Status filter
  const statusFilter: Prisma.UserWhereInput = status
    ? {
        emailVerified:
          status === 'verified' ? { not: false } : { equals: false },
        ...baseFilter,
      }
    : {
        ...baseFilter,
      };

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit || undefined,
    skip: (page - 1) * (limit || 0),
    where: {
      ...filterQuery,
      ...roleFilter,
      ...statusFilter,
    },
    include: {
      _count: {
        select: { orders: true },
      },
    },
  });

  const totalUsers = await prisma.user.count({
    where: {
      ...filterQuery,
      ...roleFilter,
      ...statusFilter,
    },
  });

  const totalPages = limit ? Math.ceil(totalUsers / limit) : 1;

  return {
    users: convertToPlainObject(
      users.map((user) => {
        return {
          ...user,
          billingInfo: user.billingInfo as BillingInfo,
          ordersCount: user._count.orders,
        };
      }),
    ),
    totalPages,
  };
};
