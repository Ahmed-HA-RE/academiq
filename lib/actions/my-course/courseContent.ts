'use server';

import { prisma } from '@/lib/prisma';

// Get total lessons count in a course
export const getTotalLessonsCount = async (courseId: string) => {
  const lessonsCount = await prisma.lesson.count({
    where: { section: { courseId: courseId }, status: 'ready' },
  });

  return lessonsCount;
};
