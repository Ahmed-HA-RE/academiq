'use server';

import { prisma } from '@/lib/prisma';
import { convertToPlainObject } from '@/lib/utils';
import { getCurrentLoggedInInstructor } from '../instructor/getInstructor';
import { Prisma } from '@/lib/generated/prisma/client';

// Get all courses
export const getAllCourses = async ({
  q,
  category,
  page = 1,
  limit = 10,
}: {
  q?: string;
  category?: string;
  page?: number;
  limit?: number;
}) => {
  // Query Filter
  const filterQuery: Prisma.CourseWhereInput = q
    ? {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          {
            instructor: {
              user: { name: { contains: q, mode: 'insensitive' } },
            },
          },
        ],
      }
    : {};

  // Category Filter
  const categoryFilter: Prisma.CourseWhereInput =
    category && category !== 'All'
      ? {
          category: { equals: category, mode: 'insensitive' },
        }
      : {};

  const courses = await prisma.course.findMany({
    where: {
      ...filterQuery,
      ...categoryFilter,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
    include: {
      instructor: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
              id: true,
              email: true,
              banned: true,
              role: true,
            },
          },
        },
      },
    },
  });

  const totalCount = await prisma.course.count({
    where: {
      ...filterQuery,
      ...categoryFilter,
    },
  });

  const totalPages = Math.ceil(totalCount / limit);

  if (!courses) throw new Error('No courses found');

  return convertToPlainObject({ courses, totalPages });
};

// Get course by id
export const getCourseById = async (id: string) => {
  const course = await prisma.course.findUnique({
    where: { id, published: true },
    include: {
      _count: {
        select: {
          users: true,
        },
      },
      instructor: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
              id: true,
              email: true,
              banned: true,
              role: true,
            },
          },
        },
      },
      sections: {
        include: {
          lessons: {
            include: {
              muxData: {
                select: {
                  muxAssetId: true,
                  muxPlaybackId: true,
                  uploadthingFileId: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return convertToPlainObject(course);
};

export const getAllInstructorCourses = async ({
  status,
  q,
  limit = 10,
  page,
}: {
  status?: string;
  q?: string;
  limit?: number;
  page?: number;
}) => {
  const instructor = await getCurrentLoggedInInstructor();

  const courses = await prisma.course.findMany({
    where: {
      instructorId: instructor.id,
      ...(status === 'published'
        ? { published: true }
        : status === 'unpublished'
          ? { published: false }
          : {}),
      ...(q ? { title: { contains: q, mode: 'insensitive' } } : {}),
    },
    include: {
      _count: {
        select: {
          users: true,
        },
      },

      sections: {
        include: {
          lessons: {
            include: {
              muxData: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip: page ? (page - 1) * limit : 0,
  });

  const totalCourses = await prisma.course.count({
    where: {
      instructorId: instructor.id,
      ...(status === 'published'
        ? { published: true }
        : status === 'unpublished'
          ? { published: false }
          : {}),
      ...(q ? { title: { contains: q, mode: 'insensitive' } } : {}),
    },
  });

  const totalPages = Math.ceil(totalCourses / limit);

  return {
    courses: courses.map((course) =>
      convertToPlainObject({
        ...course,
        studentsCount: course._count.users,
      }),
    ),
    totalPages,
  };
};
