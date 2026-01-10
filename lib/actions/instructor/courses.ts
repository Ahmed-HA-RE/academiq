import { prisma } from '@/lib/prisma';
import { getCurrentLoggedInInstructor } from '.';
import { convertToPlainObject } from '@/lib/utils';

export const getAllInstructorCourses = async () => {
  const instructor = await getCurrentLoggedInInstructor();

  const courses = await prisma.course.findMany({
    where: {
      instructorId: instructor.id,
    },
    include: {
      _count: {
        select: {
          users: true,
        },
      },

      sections: {
        include: {
          lessons: true,
        },
      },
    },
  });

  return {
    courses: courses.map((course) =>
      convertToPlainObject({
        ...course,
        studentsCount: course._count.users,
      })
    ),
  };
};
