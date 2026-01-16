'use server';

import { prisma } from '../../prisma';
import { getCurrentLoggedInInstructor } from '../instructor/getInstructor';
import { revalidatePath } from 'next/cache';

// Delete course sections
export const deleteCourseSections = async (sectionId: string | undefined) => {
  try {
    const instructor = await getCurrentLoggedInInstructor();

    if (sectionId) {
      const section = await prisma.section.findUnique({
        where: {
          id: sectionId,
          course: {
            instructorId: instructor.id,
          },
        },
      });

      if (!section) {
        throw new Error(
          'Section not found or you do not have permission to delete it'
        );
      }

      await prisma.section.deleteMany({
        where: {
          id: section.id,
          course: {
            instructorId: instructor.id,
          },
        },
      });
    }
    revalidatePath('/', 'layout');
    return { success: true, message: 'Section deleted successfully.' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

// Delete course lessons
export const deleteCourseLessons = async (lessonId: string | undefined) => {
  try {
    const instructor = await getCurrentLoggedInInstructor();

    if (lessonId) {
      const lesson = await prisma.lesson.findUnique({
        where: {
          id: lessonId,
          section: {
            course: {
              instructorId: instructor.id,
            },
          },
        },
      });

      if (!lesson) {
        throw new Error(
          'Lesson not found or you do not have permission to delete it'
        );
      }

      await prisma.lesson.deleteMany({
        where: {
          id: lesson.id,
          section: {
            course: {
              instructorId: instructor.id,
            },
          },
        },
      });
    }
    revalidatePath('/', 'layout');
    return { success: true, message: 'Lesson deleted successfully.' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
