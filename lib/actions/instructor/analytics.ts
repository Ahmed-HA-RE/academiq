'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { convertToPlainObject } from '@/lib/utils';
import { getYear, lastDayOfYear } from 'date-fns';
import { headers } from 'next/headers';
import { getCurrentLoggedInInstructor } from './getInstructor';

// Get total students across all courses
export const getTotalStudentsCount = async () => {
  const instructor = await getCurrentLoggedInInstructor();

  const studentsCount = await prisma.user.count({
    where: {
      courses: {
        some: {
          instructorId: instructor.id,
        },
      },
    },
  });

  return studentsCount;
};

// Get total courses by instructor
export const getTotalCoursesByInstructor = async () => {
  const instructor = await getCurrentLoggedInInstructor();

  const coursesCount = await prisma.course.count({
    where: {
      instructorId: instructor.id,
    },
  });

  return coursesCount;
};

// Get total revenue by instructor
export const getTotalRevenueByInstructor = async () => {
  const instructor = await getCurrentLoggedInInstructor();

  const discount = await prisma.discount.findFirst({
    where: {
      orders: {
        some: {
          orderItems: {
            some: {
              course: {
                instructorId: instructor.id,
              },
            },
          },
        },
      },
    },
  });

  const revenueData = await prisma.orderItems.aggregate({
    _sum: {
      price: true,
    },
    where: {
      course: {
        instructorId: instructor.id,
      },
      order: {
        status: 'paid',
      },
    },
  });

  const totalAmount = Number(revenueData._sum.price) || 0;
  const discountAmount = discount ? discount.amount : 0;

  return totalAmount - discountAmount;
};

// Get monthly revenue for instructor
export const getMonthlyRevenueForInstructor = async () => {
  const instructor = await getCurrentLoggedInInstructor();

  const currentYear = getYear(new Date());
  const previousYear = currentYear - 1;

  const orders = await prisma.order.findMany({
    where: {
      isPaid: true,
      status: 'paid',
      createdAt: {
        gte: lastDayOfYear(new Date(previousYear, 11, 31)),
        lte: lastDayOfYear(new Date(currentYear, 11, 31)),
      },
      orderItems: {
        some: {
          course: {
            instructorId: {
              equals: instructor.id,
            },
          },
        },
      },
    },
    select: {
      totalPrice: true,
      createdAt: true,
    },
  });

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(currentYear, i).toLocaleString('default', {
      month: 'long',
    });
    const currentYearRevenue = orders
      .filter(
        (order) =>
          order.createdAt.getMonth() === i &&
          order.createdAt.getFullYear() === currentYear,
      )
      .reduce((sum, order) => sum + parseFloat(order.totalPrice), 0);

    const previousYearRevenue = orders
      .filter(
        (order) =>
          order.createdAt.getMonth() === i &&
          order.createdAt.getFullYear() === previousYear,
      )
      .reduce((sum, order) => sum + parseFloat(order.totalPrice), 0);

    return {
      name: month,
      pv: currentYearRevenue,
      uv: previousYearRevenue,
      amt: currentYearRevenue,
    };
  });

  return monthlyData;
};

// Get total revenue after (current year)
export const getTotalRevenueAfterForInstructor = async () => {
  const currentYear = new Date().getFullYear();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'instructor')
    throw new Error('Unauthorized to fetch analytics');

  const totalRevenue = await prisma.order.aggregate({
    _sum: { totalPrice: true },
    where: {
      isPaid: true,
      status: 'paid',
      createdAt: {
        gte: new Date(`${currentYear}`),
      },
      orderItems: {
        some: {
          course: {
            instructorId: {
              equals: session.user.id,
            },
          },
        },
      },
    },
  });
  return Number(totalRevenue._sum.totalPrice) || 0;
};

// Get total revenue before (previous year)
export const getTotalRevenueBeforeForInstructor = async () => {
  const currentYear = getYear(new Date());
  const previousYear = currentYear - 1;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'instructor')
    throw new Error('Unauthorized to fetch analytics');

  const totalRevenue = await prisma.order.aggregate({
    _sum: { totalPrice: true },
    where: {
      isPaid: true,
      status: 'paid',
      createdAt: {
        lte: new Date(`${previousYear}-12-31`),
      },
      orderItems: {
        some: {
          course: {
            instructorId: {
              equals: session.user.id,
            },
          },
        },
      },
    },
  });
  return Number(totalRevenue._sum.totalPrice) || 0;
};

// Get popular courses by instructor
export const getPopularCoursesByInstructor = async () => {
  const instructor = await getCurrentLoggedInInstructor();

  const popularCourses = await prisma.course.findMany({
    where: {
      instructorId: instructor.id,
      users: {
        some: {
          id: { not: undefined },
        },
      },
      orderItems: {
        some: {
          order: {
            isPaid: true,
            status: 'paid',
          },
        },
      },
    },
    orderBy: {
      users: {
        _count: 'desc',
      },
    },
    include: {
      _count: { select: { users: true } },
    },
    take: 5,
  });

  return popularCourses;
};

// Get courses by instructor with user progress completion percentages
export const getCoursesWithProgressByInstructor = async () => {
  const instructor = await getCurrentLoggedInInstructor();

  const courses = await prisma.course.findMany({
    where: {
      instructorId: instructor.id,
    },
    include: {
      userProgress: {
        select: {
          progress: true,
        },
      },
    },
  });

  // Aggregate all progress data across all courses
  const progressRanges = {
    '0-10%': 0,
    '11-40%': 0,
    '41-60%': 0,
    '61-99%': 0,
    '100%': 0,
  };

  courses.forEach((course) => {
    course.userProgress.forEach((up) => {
      const percent = Number(up.progress);

      // Categorize by range
      if (percent === 0 || percent <= 10) progressRanges['0-10%']++;
      else if (percent <= 40) progressRanges['11-40%']++;
      else if (percent <= 60) progressRanges['41-60%']++;
      else if (percent < 100) progressRanges['61-99%']++;
      else progressRanges['100%']++;
    });
  });

  // Format data for bar chart (X-axis: range, Y-axis: count)
  const chartData = [
    { range: '0-10%', students: progressRanges['0-10%'] },
    { range: '11-40%', students: progressRanges['11-40%'] },
    { range: '41-60%', students: progressRanges['41-60%'] },
    { range: '61-99%', students: progressRanges['61-99%'] },
    { range: '100%', students: progressRanges['100%'] },
  ];

  return chartData;
};

// Get students data for instructor's courses
export const getEnrolledStudentsForInstructor = async ({
  limit,
  q,
  page = 1,
}: {
  limit?: number;
  q?: string;
  page?: number;
}) => {
  const instructor = await getCurrentLoggedInInstructor();

  const students = await prisma.orderItems.findMany({
    where: {
      AND: [
        {
          course: {
            instructorId: instructor.id,
          },
          order: {
            isPaid: true,
            status: 'paid',
            ...(q
              ? { user: { name: { contains: q, mode: 'insensitive' } } }
              : {}),
          },
        },
      ],
    },
    select: {
      order: {
        select: {
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              userProgress: {
                where: {
                  course: {
                    instructorId: instructor.id,
                  },
                },
              },
            },
          },
        },
      },
      course: {
        select: {
          title: true,
          id: true,
        },
      },
    },
    orderBy: {
      order: {
        createdAt: 'desc',
      },
    },
    take: limit,
    skip: limit ? (page - 1) * limit : undefined,
  });

  const totalStudentsCount = await prisma.orderItems.count({
    where: {
      AND: [
        {
          course: {
            instructorId: instructor.id,
          },
          order: {
            isPaid: true,
            ...(q
              ? { user: { name: { contains: q, mode: 'insensitive' } } }
              : {}),
          },
        },
      ],
    },
  });

  const totalPages = limit ? Math.ceil(totalStudentsCount / limit) : 1;

  return {
    students: students.map((student) =>
      convertToPlainObject({
        studentName: student.order.user.name,
        studentEmail: student.order.user.email,
        studentImage: student.order.user.image,
        enrolledAt: student.order.createdAt,
        courseName: student.course.title,
        courseId: student.course.id,
        progress:
          student.order.user.userProgress.find(
            (s) => s.courseId === student.course.id,
          )?.progress || 0,
      }),
    ),
    totalPages,
  };
};

// Get total count of students who finished course for instructor
export const getTotalStudentsCompletedCourseForInstructor = async (
  courseSlug: string,
) => {
  const instructor = await getCurrentLoggedInInstructor();

  const completedCount = await prisma.userProgress.count({
    where: {
      progress: 100,
      course: {
        instructorId: instructor.id,
        slug: courseSlug,
      },
    },
  });

  return completedCount;
};

// Get total count of students who haven't finished course for instructor
export const getTotalStudentsUncompletedCourseForInstructor = async (
  courseSlug: string,
) => {
  const instructor = await getCurrentLoggedInInstructor();

  const unCompletedCount = await prisma.userProgress.count({
    where: {
      progress: { lt: 100, gt: 0 },
      course: {
        instructorId: instructor.id,
        slug: courseSlug,
      },
    },
  });

  return unCompletedCount;
};
// Get total count of students who haven't started course for instructor
export const getTotalStudentsNotStartedCourseForInstructor = async (
  courseSlug: string,
) => {
  const instructor = await getCurrentLoggedInInstructor();

  const notStartedCount = await prisma.userProgress.count({
    where: {
      progress: { equals: 0 },
      course: {
        instructorId: instructor.id,
        slug: courseSlug,
      },
    },
  });

  return notStartedCount;
};
