'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentLoggedUser } from '../getUser';

export const markLessonAsComplete = async (lessonId: string) => {
  try {
    const user = await getCurrentLoggedUser();

    if (!user) throw new Error('User not authenticated');

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!lesson) throw new Error('Lesson not found');

    const updatedProgress = await prisma.$transaction(async (tx) => {
      const newProgress = await tx.lessonProgress.create({
        data: {
          userId: user.id,
          lessonId: lesson.id,
          completed: true,
        },
        include: {
          lesson: {
            include: {
              section: {
                select: {
                  courseId: true,
                },
              },
            },
          },
        },
      });

      const totalLessons = await tx.lesson.count({
        where: {
          section: {
            courseId: newProgress.lesson.section.courseId,
          },
          status: 'ready',
        },
      });

      const completedLessons = await tx.lessonProgress.count({
        where: {
          userId: user.id,
          lesson: {
            section: {
              courseId: newProgress.lesson.section.courseId,
            },
          },
          completed: true,
        },
      });

      const progressPercentage = Math.floor(
        (completedLessons / totalLessons) * 100,
      );

      const updatedProgress = await tx.userProgress.update({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: newProgress.lesson.section.courseId,
          },
        },
        data: {
          progress: progressPercentage,
        },
      });
      return updatedProgress.progress;
    });

    return {
      success: true,
      message: 'Progress updated',
      progress: updatedProgress,
    };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const markLessonAsIncomplete = async (lessonId: string) => {
  try {
    const user = await getCurrentLoggedUser();

    if (!user) throw new Error('User not authenticated');

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!lesson) throw new Error('Lesson not found');

    await prisma.$transaction(async (tx) => {
      const deletedProgress = await tx.lessonProgress.delete({
        where: {
          userId_lessonId: {
            lessonId,
            userId: user.id,
          },
        },
        include: {
          lesson: {
            include: {
              section: {
                select: {
                  courseId: true,
                },
              },
            },
          },
        },
      });

      const totalLessons = await tx.lesson.count({
        where: {
          section: {
            courseId: deletedProgress.lesson.section.courseId,
          },
          status: 'ready',
        },
      });

      const completedLessons = await tx.lessonProgress.count({
        where: {
          userId: user.id,
          lesson: {
            section: {
              courseId: deletedProgress.lesson.section.courseId,
            },
          },
          completed: true,
        },
      });

      const updatedProgressPercentage = Math.floor(
        (completedLessons / totalLessons) * 100,
      );

      await tx.userProgress.update({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: deletedProgress.lesson.section.courseId,
          },
        },
        data: {
          progress: updatedProgressPercentage,
        },
      });
    });

    return { success: true, message: 'Progress updated' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
