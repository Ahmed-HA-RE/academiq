'use server';

import { convertToPlainObject } from '@/lib/utils';
import { getCurrentLoggedUser } from '../getUser';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/lib/generated/prisma';

// Get all user's enrolled courses
export const getUserEnrolledCourses = async (search?: string) => {
  const user = await getCurrentLoggedUser();

  if (!user) throw new Error('User not found');

  const baseSearch: Prisma.CourseWhereInput = {
    AND: [{ users: { some: { id: user.id } } }, { published: true }],
  };

  // Filter Search Query
  const searchFilter: Prisma.CourseWhereInput = search
    ? {
        ...baseSearch,
        OR: [
          {
            title: { contains: search, mode: 'insensitive' },
          },
          {
            instructor: {
              user: { name: { contains: search, mode: 'insensitive' } },
            },
          },
        ],
      }
    : baseSearch;

  const enrolledCourses = await prisma.course.findMany({
    where: {
      ...searchFilter,
    },
    include: {
      sections: {
        include: {
          lessons: {
            include: {
              muxData: true,
            },
          },
        },
      },
      instructor: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return enrolledCourses.map((course) => convertToPlainObject(course));
};

// Get user's progress in courses
export const getUserCourseProgress = async (courseId: string) => {
  const user = await getCurrentLoggedUser();

  const progress = await prisma.userProgress.findFirst({
    where: { userId: user?.id, courseId: courseId },
  });

  if (!progress) throw new Error('Progress not found');
  return convertToPlainObject(progress);
};

export const getMyCourseById = async (id: string) => {
  const user = await getCurrentLoggedUser();

  if (!user) throw new Error('User not found');

  const course = await prisma.course.findUnique({
    where: {
      id,
    },
    include: {
      sections: {
        include: {
          lessons: {
            where: {
              status: 'ready',
            },
            include: {
              lessonProgresses: {
                where: {
                  userId: user.id,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!course) throw new Error('Course not found');
  return convertToPlainObject(course);
};
