import { prisma } from '../prisma';
import { convertToPlainObject } from '../utils';

// Get all courses
export const getAllCourses = async () => {
  const courses = await prisma.course.findMany();
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
