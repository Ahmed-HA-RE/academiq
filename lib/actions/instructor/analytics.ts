import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getYear, lastDayOfYear } from 'date-fns';
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

// Get monthly revenue for instructor
export const getMonthlyRevenueForInstructor = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'instructor')
    throw new Error('Unauthorized to fetch analytics');

  const currentYear = getYear(new Date());
  const previousYear = currentYear - 1;

  const orders = await prisma.order.findMany({
    where: {
      isPaid: true,
      createdAt: {
        gte: lastDayOfYear(new Date(previousYear, 11, 31)),
        lte: lastDayOfYear(new Date(currentYear, 11, 31)),
      },
      orderItems: {
        every: {
          course: {
            instructorId: {
              equals: session.user.id,
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
    const month = new Date(2024, i).toLocaleString('default', {
      month: 'long',
    });
    const currentYearRevenue = orders
      .filter(
        (order) =>
          order.createdAt.getMonth() === i &&
          order.createdAt.getFullYear() === currentYear
      )
      .reduce((sum, order) => sum + Number(order.totalPrice), 0);

    const previousYearRevenue = orders
      .filter(
        (order) =>
          order.createdAt.getMonth() === i &&
          order.createdAt.getFullYear() === previousYear
      )
      .reduce((sum, order) => sum + Number(order.totalPrice), 0);

    return {
      name: month,
      pv: Math.round(currentYearRevenue / 100),
      uv: Math.round(previousYearRevenue / 100),
      amt: Math.round(currentYearRevenue / 100),
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
      createdAt: {
        gte: new Date(`${currentYear}`),
      },
      orderItems: {
        every: {
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
      createdAt: {
        lte: new Date(`${previousYear}-12-31`),
      },
      orderItems: {
        every: {
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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'instructor')
    throw new Error('Unauthorized to fetch analytics');

  const popularCourses = await prisma.course.findMany({
    where: {
      instructorId: session.user.id,
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
