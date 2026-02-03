'use server';

import { prisma } from '../prisma';

// Get total sales amount
export const getTotalSalesAmount = async () => {
  const totalSales = await prisma.order.aggregate({
    _sum: {
      totalPrice: true,
    },
    where: {
      isPaid: true,
      status: 'paid',
    },
  });
  return totalSales._sum.totalPrice || 0;
};

export const getMonthlyRevenue = async () => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  const orders = await prisma.order.findMany({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(`${previousYear}-01-01`),
        lte: new Date(`${currentYear}-12-31`),
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
          order.createdAt.getFullYear() === currentYear,
      )
      .reduce((sum, order) => sum + Number(order.totalPrice), 0);

    const previousYearRevenue = orders
      .filter(
        (order) =>
          order.createdAt.getMonth() === i &&
          order.createdAt.getFullYear() === previousYear,
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

export const getTotalRevenueAfter = async () => {
  const currentYear = new Date().getFullYear();

  const totalRevenue = await prisma.order.aggregate({
    _sum: { totalPrice: true },
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(`${currentYear}`),
      },
    },
  });
  return Number(totalRevenue._sum.totalPrice) || 0;
};
export const getTotalRevenueBefore = async () => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  const totalRevenue = await prisma.order.aggregate({
    _sum: { totalPrice: true },
    where: {
      isPaid: true,
      createdAt: {
        lte: new Date(`${previousYear}-12-31`),
      },
    },
  });
  return Number(totalRevenue._sum.totalPrice) || 0;
};

// Get orders monthly revenue
export const getOrdersMonthlyRevenue = async () => {
  const currentYear = new Date().getFullYear();

  const orders = await prisma.order.findMany({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(`${currentYear}-01-01`),
        lte: new Date(`${currentYear}-12-31`),
      },
    },
    select: {
      totalPrice: true,
      createdAt: true,
    },
  });

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthFull = new Date(currentYear, i).toLocaleString('default', {
      month: 'long',
    });
    const monthShort = monthFull.slice(0, 3);

    const monthRevenue = orders
      .filter((order) => order.createdAt.getMonth() === i)
      .reduce((sum, order) => sum + Number(order.totalPrice), 0);

    return {
      month: monthShort,
      revenue: Math.round(monthRevenue / 100),
      totalPrice: monthRevenue,
    };
  });

  return monthlyData;
};
