import { Prisma } from '../generated/prisma';
import { prisma } from '../prisma';
import { convertToPlainObject } from '../utils';

// Get all courses
export const getAllCourses = async ({
  q,
  rating,
  priceMin,
  priceMax,
  difficulty,
}: {
  q?: string;
  rating?: number[] | null;
  priceMin?: number;
  priceMax?: number;
  difficulty?: string[];
}) => {
  const filterQuery: Prisma.CourseWhereInput = q
    ? { title: { contains: q, mode: 'insensitive' } }
    : {};

  const ratingFilter: Prisma.CourseWhereInput =
    rating && rating.length > 0
      ? {
          rating: {
            lte: rating[1],
            gte: rating[0],
          },
        }
      : {};

  const courses = await prisma.course.findMany({
    where: { ...filterQuery, ...ratingFilter },
    orderBy: { createdAt: 'desc' },
  });
  if (!courses) throw new Error('No courses found');
  return convertToPlainObject(courses);
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
