'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentLoggedUser } from '../getUser';
import { convertToPlainObject } from '@/lib/utils';

export const getCourseReviews = async (slug: string, page = 1, limit = 5) => {
  const reviews = await prisma.review.findMany({
    where: {
      course: {
        slug: slug,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const totalCReviews = await prisma.review.count({
    where: {
      course: {
        slug: slug,
      },
    },
  });

  const totalPages = Math.ceil(totalCReviews / limit);

  return {
    reviews: convertToPlainObject(reviews),
    totalPages,
  };
};

export const getUserReview = async (courseId: string) => {
  const user = await getCurrentLoggedUser();

  const review = await prisma.review.findFirst({
    where: {
      userId: user?.id,
      courseId: courseId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  if (!review) return undefined;

  return convertToPlainObject(review);
};

export const getAverageCourseRating = async (courseId: string) => {
  const avgReviews = await prisma.review.aggregate({
    _avg: {
      rating: true,
    },
    where: {
      courseId: courseId,
    },
  });

  return convertToPlainObject(Number(avgReviews._avg.rating) || 0);
};
