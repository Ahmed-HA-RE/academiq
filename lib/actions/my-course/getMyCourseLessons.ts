'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentLoggedUser } from '../getUser';

// Get total lessons count in a course
export const getTotalLessonsCount = async (courseId: string) => {
  const lessonsCount = await prisma.lesson.count({
    where: { section: { courseId: courseId } },
  });

  return lessonsCount;
};

// Get first lesson of a course
export const getFirstLessonOfCourse = async (courseId: string) => {
  const firstLesson = await prisma.lesson.findFirst({
    where: { section: { courseId: courseId } },
    orderBy: { createdAt: 'asc' },
  });

  if (!firstLesson) throw new Error('No lessons found for this course');

  return firstLesson;
};

// Get Last unfinished lesson of a course for a user
export const getLastUnfinishedLessonOfCourse = async (courseId: string) => {
  const user = await getCurrentLoggedUser();

  if (!user) throw new Error('User not found');

  const lastUnfinishedLesson = await prisma.lesson.findFirst({
    where: {
      section: { courseId: courseId },
      NOT: {
        lessonProgresses: {
          some: {
            userId: user.id,
            completed: true,
          },
        },
      },
    },
    orderBy: { position: 'asc' },
  });

  if (!lastUnfinishedLesson)
    throw new Error('No unfinished lessons found for this course');

  return lastUnfinishedLesson;
};
