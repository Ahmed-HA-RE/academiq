'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentLoggedUser } from '../getUser';

export const getCourseLessonById = async (lessonId: string) => {
  const user = await getCurrentLoggedUser();

  if (!user) throw new Error('User not authenticated');

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    include: {
      section: {
        select: {
          id: true,
          course: {
            select: {
              slug: true,
            },
          },
        },
      },
      muxData: true,
      lessonProgresses: {
        where: {
          userId: user.id,
          lessonId: lessonId,
        },
      },
    },
  });

  const nextLesson = await prisma.lesson.findFirst({
    where: {
      section: {
        id: lesson?.section.id,
      },
      position: {
        gt: lesson?.position,
      },
    },
    orderBy: {
      position: 'asc',
    },
  });

  return {
    lesson,
    nextLesson: nextLesson,
  };
};

export const getLessonProgress = async (lessonId: string) => {
  const user = await getCurrentLoggedUser();

  if (!user) throw new Error('User not authenticated');

  const lessonProgress = await prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId: lessonId,
      },
    },
  });

  return lessonProgress?.completed || false;
};

export const getCourseLessonsProgress = async (courseId: string) => {
  const user = await getCurrentLoggedUser();

  if (!user) throw new Error('User not authenticated');

  const lessonsProgress = await prisma.lessonProgress.findMany({
    where: {
      userId: user.id,
      lesson: {
        section: {
          courseId: courseId,
        },
      },
    },
  });

  return lessonsProgress;
};
