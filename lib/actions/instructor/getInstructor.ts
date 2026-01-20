'use server';

import { auth } from '@/lib/auth';
import { Prisma } from '@/lib/generated/prisma';
import { prisma } from '@/lib/prisma';
import { convertToPlainObject } from '@/lib/utils';
import { SocialLinks } from '@/types';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// Get total Instructors count
export const getTotalInstructorsCount = async () => {
  const count = await prisma.user.count({
    where: { role: 'instructor' },
  });
  return count;
};

export const getAllInstructorsAsAdmin = async ({
  limit = 10,
  page = 1,
  search,
  status,
}: {
  limit?: number;
  page?: number;
  search?: string;
  status?: string;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin')
    throw new Error('Unauthorized to get instructors');

  // Search Filter
  const searchFilter: Prisma.InstructorWhereInput = search
    ? {
        AND: [
          {
            OR: [
              { user: { name: { contains: search, mode: 'insensitive' } } },
              { user: { email: { contains: search, mode: 'insensitive' } } },
            ],
          },
        ],
        user: { role: 'instructor' },
      }
    : { user: { role: 'instructor' } };

  // Status Filter
  const statusFilter: Prisma.InstructorWhereInput = status
    ? {
        user: {
          banned: status === 'banned' ? true : false,
        },
      }
    : { user: { role: 'instructor' } };

  const instructors = await prisma.instructor.findMany({
    where: {
      ...searchFilter,
      ...statusFilter,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
          banned: true,
          id: true,
          role: true,
        },
      },
      _count: { select: { courses: true } },
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const totalInstructors = await prisma.instructor.count({
    where: {
      ...searchFilter,
      ...statusFilter,
    },
  });

  const totalPages = Math.ceil(totalInstructors / limit);

  return {
    instructors: instructors.map((instructor) =>
      convertToPlainObject({
        ...instructor,
        socialLinks: instructor.socialLinks as SocialLinks,
        coursesCount: instructor._count.courses,
      }),
    ),
    totalPages,
  };
};

export const getInstructorByIdAsAdmin = async (instructorId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin')
    throw new Error('Unauthorized to delete this resource');

  const instructor = await prisma.instructor.findUnique({
    where: { id: instructorId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
          banned: true,
          role: true,
          id: true,
        },
      },
    },
  });

  if (!instructor) throw new Error('Instructor not found');

  return convertToPlainObject({
    ...instructor,
    socialLinks: instructor.socialLinks as SocialLinks,
  });
};

// Get current logged in instructor
export const getCurrentLoggedInInstructor = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect('/');

  const instructor = await prisma.instructor.findUnique({
    where: { userId: session.user.id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
          banned: true,
          id: true,
          role: true,
        },
      },
    },
  });

  if (!instructor) throw new Error('Instructor not found');

  return convertToPlainObject({
    ...instructor,
    socialLinks: instructor.socialLinks as SocialLinks,
  });
};
