import { Prisma } from '../generated/prisma';
import { prisma } from '../prisma';
import { convertToPlainObject } from '../utils';

// Get all courses
export const getAllCourses = async ({
  q,
  rating,
  price,
  difficulty,
  sortBy,
  page = 1,
  limit = 5,
}: {
  q?: string;
  rating?: number[];
  price?: string;
  difficulty?: string[];
  sortBy?: string;
  page?: number;
  limit?: number;
}) => {
  // Query Filter
  const filterQuery: Prisma.CourseWhereInput = q
    ? { title: { contains: q, mode: 'insensitive' } }
    : {};

  // Rating Filter
  const ratingFilter: Prisma.CourseWhereInput =
    rating && rating.length > 0
      ? {
          rating: {
            lte: rating[1],
            gte: rating[0],
          },
        }
      : {};

  // Price Filter
  const priceFilter: Prisma.CourseWhereInput =
    price && price.includes('-')
      ? {
          currentPrice: {
            lte: Number(price.split('-')[1]),
            gte: Number(price.split('-')[0]),
          },
        }
      : price
        ? {
            currentPrice: { gte: Number(price) },
          }
        : {};

  // Difficulty Filter
  const difficultyFilter: Prisma.CourseWhereInput =
    difficulty && difficulty.length > 0
      ? {
          difficulty: { in: difficulty },
        }
      : {};

  // Sorting Filter
  const sortingFilter: Prisma.CourseOrderByWithRelationInput =
    sortBy === 'newest'
      ? { createdAt: 'asc' }
      : sortBy === 'oldest'
        ? { createdAt: 'desc' }
        : sortBy === 'price-asc'
          ? { currentPrice: 'asc' }
          : sortBy === 'price-desc'
            ? { currentPrice: 'desc' }
            : {};

  const courses = await prisma.course.findMany({
    where: {
      ...filterQuery,
      ...ratingFilter,
      ...priceFilter,
      ...difficultyFilter,
    },
    orderBy: { ...sortingFilter },
    take: limit,
    skip: (page - 1) * limit,
  });

  const totalCount = await prisma.course.count({
    where: {
      ...filterQuery,
      ...ratingFilter,
      ...priceFilter,
      ...difficultyFilter,
    },
  });

  const totalPages = Math.ceil(totalCount / limit);

  if (!courses) throw new Error('No courses found');

  return convertToPlainObject({ courses, totalPages });
};

// Get featured courses
export const getFeaturedCourses = async () => {
  const courses = await prisma.course.findMany({
    where: { isFeatured: true },
    take: 3,
  });
  return convertToPlainObject(courses);
};

// Get course by slug
export const getCourseBySlug = async (slug: string) => {
  const course = await prisma.course.findFirst({
    where: { slug },
    include: {
      users: true,
    },
  });
  return convertToPlainObject(course);
};
