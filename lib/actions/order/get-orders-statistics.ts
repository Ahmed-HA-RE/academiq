'use server';
import { prisma } from '../../prisma';

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

  const totalSalesAmount = Math.round(Number(totalSales._sum.totalPrice));

  return totalSalesAmount.toFixed(2);
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
