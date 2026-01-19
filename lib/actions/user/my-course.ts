'use server';

import { convertToPlainObject } from '@/lib/utils';
import { getCurrentLoggedUser } from './getUser';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/lib/generated/prisma';

// Get all user's enrolled courses
export const getUserEnrolledCourses = async (search?: string) => {
  const user = await getCurrentLoggedUser();

  if (!user) throw new Error('User not found');

  const baseSearch = {
    AND: [{ users: { some: { id: user.id } } }, { published: true }],
  };

  // Filter Search Query
  const searchFilter: Prisma.CourseWhereInput = search
    ? { ...baseSearch, title: { contains: search, mode: 'insensitive' } }
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
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return enrolledCourses.map((course) => convertToPlainObject(course));
};

// Get user's progress in courses
export const getUserProgress = async (courseId: string) => {
  const user = await getCurrentLoggedUser();

  const progress = await prisma.userProgress.findFirst({
    where: { userId: user?.id, courseId: courseId },
  });

  if (!progress) return undefined;
  return convertToPlainObject(progress);
};

// Get total lessons count in a course
export const getTotalLessonsCount = async (courseId: string) => {
  const lessonsCount = await prisma.lesson.count({
    where: { section: { courseId: courseId } },
  });

  return lessonsCount;
};
