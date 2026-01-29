'use server';

import { CreateReview } from '@/types';
import { courseReviewSchema } from '@/schema';
import { getCurrentLoggedUser } from '../getUser';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const createReview = async (courseId: string, data: CreateReview) => {
  try {
    const user = await getCurrentLoggedUser();

    if (!user) throw new Error('You must be logged in to submit a review.');

    if (!user.emailVerified)
      throw new Error('Please verify your email to submit a review.');

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { instructor: { select: { userId: true } } },
    });

    if (!course) throw new Error('Course not found.');

    const review = await prisma.review.findFirst({
      where: {
        courseId: course.id,
        userId: user.id,
      },
    });

    if (review)
      throw new Error('You have already submitted a review for this course.');

    if (user.id === course.instructor.userId)
      throw new Error('Instructors cannot review their own courses.');

    const validatedData = courseReviewSchema.safeParse(data);

    if (!validatedData.success) throw new Error('Invalid review data.');

    await prisma.review.create({
      data: validatedData.data,
    });

    revalidatePath(`/course/${course.id}`);
    return { success: true, message: 'Review submitted successfully.' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const updateUserReview = async (
  courseId: string,
  data: CreateReview,
) => {
  try {
    const user = await getCurrentLoggedUser();

    if (!user) throw new Error('You must be logged in to update your review.');

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { instructor: { select: { userId: true } } },
    });

    if (!course) throw new Error('Course not found.');

    const review = await prisma.review.findFirst({
      where: {
        courseId: course.id,
        userId: user.id,
      },
    });

    if (!review)
      throw new Error('You have not submitted a review for this course.');

    if (user.id === course.instructor.userId)
      throw new Error('Instructors cannot review their own courses.');

    const validatedData = courseReviewSchema.safeParse(data);

    if (!validatedData.success) throw new Error('Invalid review data.');

    await prisma.review.update({
      where: { id: review.id },
      data: validatedData.data,
    });

    revalidatePath(`/course/${course.id}`);
    return { success: true, message: 'Review updated successfully.' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
