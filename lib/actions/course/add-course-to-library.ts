'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentLoggedUser } from '../getUser';

export const addCourseToLibrary = async (courseId: string) => {
  try {
    const user = await getCurrentLoggedUser();

    if (!user) {
      return { success: false, message: 'Not authenticated' };
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    // if course already exists in user's library
    const isCourseInLibrary = await prisma.user.findFirst({
      where: {
        id: user.id,
        courses: {
          some: {
            id: courseId,
          },
        },
      },
    });

    if (isCourseInLibrary) {
      return { success: false, message: 'Course already in library' };
    }

    // If course is found then update user's courses
    if (course) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          courses: {
            connect: { id: courseId },
          },
        },
      });

      // Create progress entry for the user in the course
      await prisma.userProgress.create({
        data: {
          userId: user.id,
          courseId: course.id,
        },
      });
    }
    return { success: true, message: 'Course added to library' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
