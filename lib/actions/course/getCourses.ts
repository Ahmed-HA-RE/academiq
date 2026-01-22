'use server';

import { prisma } from '@/lib/prisma';
import { convertToPlainObject } from '@/lib/utils';
import { getCurrentLoggedInInstructor } from '../instructor/getInstructor';
import { Prisma } from '@/lib/generated/prisma';

// Get all courses
export const getAllCourses = async ({
  q,
  price,
  difficulty,
  category,
  sortBy,
  page = 1,
  limit = 10,
  status,
}: {
  q?: string;
  price?: string;
  difficulty?: string[];
  category?: string[];
  sortBy?: string;
  page?: number;
  limit?: number;
  status?: string;
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

  // Price Filter
  const priceFilter: Prisma.CourseWhereInput =
    price && price.includes('-')
      ? {
          price: {
            lte: Number(price.split('-')[1]),
            gte: Number(price.split('-')[0]),
          },
        }
      : price
        ? {
            price: { gte: Number(price) },
          }
        : {};

  // Difficulty Filter
  const difficultyFilter: Prisma.CourseWhereInput =
    difficulty && difficulty.length > 0
      ? {
          difficulty: { in: difficulty },
        }
      : {};

  // Category Filter
  const categoryFilter: Prisma.CourseWhereInput =
    category && category.length > 0
      ? {
          category: { in: category },
        }
      : {};

  // Sorting Filter
  const sortingFilter: Prisma.CourseOrderByWithRelationInput =
    sortBy === 'newest'
      ? { createdAt: 'asc' }
      : sortBy === 'oldest'
        ? { createdAt: 'desc' }
        : sortBy === 'price-asc'
          ? { price: 'asc' }
          : sortBy === 'price-desc'
            ? { price: 'desc' }
            : {};

  // Status Filter
  const statusFilter: Prisma.CourseWhereInput =
    status === 'published'
      ? { published: true }
      : status === 'unpublished'
        ? { published: false }
        : {};

  const courses = await prisma.course.findMany({
    where: {
      ...filterQuery,
      ...priceFilter,
      ...difficultyFilter,
      ...categoryFilter,
      ...statusFilter,
    },
    orderBy: { ...sortingFilter },
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
      ...priceFilter,
      ...difficultyFilter,
      ...categoryFilter,
      ...statusFilter,
    },
  });

  const totalPages = Math.ceil(totalCount / limit);

  if (!courses) throw new Error('No courses found');

  return convertToPlainObject({ courses, totalPages });
};

// Get course by slug
export const getCourseBySlug = async (slug: string) => {
  const course = await prisma.course.findUnique({
    where: { slug },
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

// Get total courses count
export const getTotalCoursesCount = async () => {
  const count = await prisma.course.count();
  return count;
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

// Get courses who have students enrolled
export const getCoursesWithStudents = async () => {
  const courses = await prisma.user.findMany({
    where: {
      courses: {
        some: {},
      },
    },
  });
  return courses.length;
};
