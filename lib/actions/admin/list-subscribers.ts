'use server';

import { Prisma } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';

export const listSubscribers = async ({
  status,
  search,
  limit = 10,
  page = 1,
}: {
  status: string;
  search: string;
  limit: number;
  page: number;
}) => {
  const baseQuery: Prisma.SubscriptionWhereInput = {
    status: { notIn: ['incomplete', 'incomplete_expired'] },
  };

  // Filter search
  const searchQuery: Prisma.SubscriptionWhereInput = search
    ? {
        AND: [
          {
            ...baseQuery,
          },
          {
            OR: [
              {
                user: {
                  name: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
              {
                user: {
                  email: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          },
        ],
      }
    : {
        ...baseQuery,
      };

  // Filter status
  const statusQuery: Prisma.SubscriptionWhereInput =
    status && status !== 'all'
      ? {
          ...baseQuery,
          status: status,
        }
      : {
          ...baseQuery,
        };

  const subscribers = await prisma.subscription.findMany({
    where: {
      ...searchQuery,
      ...statusQuery,
    },
    include: {
      user: {
        select: {
          image: true,
          name: true,
          email: true,
        },
      },
    },
    take: limit,
    skip: (page - 1) * limit,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const totalSubscribers = await prisma.subscription.count({
    where: {
      ...searchQuery,
      ...statusQuery,
    },
  });

  const totalPages = Math.ceil(totalSubscribers / limit);

  return {
    subscribers,
    totalPages,
  };
};
