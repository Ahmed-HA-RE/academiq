import { prisma } from '../prisma';
import { convertToPlainObject } from '../utils';

// get featured courses
export const getFeaturedCourses = async () => {
  const courses = await prisma.course.findMany({
    where: { isFeatured: true },
    take: 3,
  });
  return convertToPlainObject(courses);
};
