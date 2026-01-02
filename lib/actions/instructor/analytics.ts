import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

// Get total students across all courses
export const getTotalStudentsCount = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'instructor')
    throw new Error('Unauthorized to fetch analytics');

  const studentsCount = await prisma.user.count({
    where: {
      courses: {
        every: {
          instructorId: session.user.id,
        },
      },
    },
  });

  return studentsCount;
};

// Get total courses by instructor
export const getTotalCoursesByInstructor = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'instructor')
    throw new Error('Unauthorized to fetch analytics');

  const coursesCount = await prisma.course.count({
    where: {
      instructorId: session.user.id,
    },
  });

  return coursesCount;
};

// Get total revenue by instructor
export const getTotalRevenueByInstructor = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'instructor')
    throw new Error('Unauthorized to fetch analytics');

  const revenueData = await prisma.course.aggregate({
    _sum: {
      price: true,
    },
    where: {
      instructorId: session.user.id,
    },
  });

  return revenueData._sum.price || 0;
};
