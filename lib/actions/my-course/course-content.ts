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

// Get total lessons count in a course
export const getTotalLessonsCount = async (courseId: string) => {
  const lessonsCount = await prisma.lesson.count({
    where: { section: { courseId: courseId }, status: 'ready' },
  });

  return lessonsCount;
};

// Get course section by id
export const getCourseNextSection = async (sectionId: string) => {
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
  });

  const nextSection = await prisma.section.findFirst({
    where: { courseId: section?.courseId, position: { gt: section?.position } },
    include: {
      lessons: {
        where: {
          status: 'ready',
        },
        orderBy: { position: 'asc' },
      },
    },
  });

  return nextSection;
};
