'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentLoggedInInstructor } from '../instructor/getInstructor';
import { revalidatePath } from 'next/cache';
import { getCurrentLoggedUser } from '../getUser';

export const toggleCoursePublishStatus = async (courseId: string) => {
  try {
    const instructor = await getCurrentLoggedInInstructor();

    const course = await prisma.course.findUnique({
      where: { id: courseId, instructorId: instructor.id },
    });

    if (!course) throw new Error('Course not found');

    await prisma.course.update({
      where: { id: course.id, instructorId: course.instructorId },
      data: { published: !course.published },
    });

    revalidatePath('/', 'layout');

    return {
      success: true,
      message: `Course ${course.published ? 'Unpublished' : 'Published'} successfully.`,
    };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const toggleCoursePublishStatusAdmin = async (courseId: string) => {
  try {
    const user = await getCurrentLoggedUser();

    if (!user || user.role !== 'admin')
      throw new Error('Unauthorized to update course status');

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) throw new Error('Course not found');

    await prisma.course.update({
      where: { id: course.id },
      data: { published: !course.published },
    });

    revalidatePath('/', 'layout');

    return {
      success: true,
      message: `Course ${course.published ? 'Unpublished' : 'Published'} successfully.`,
    };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
