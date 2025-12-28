import {
  getMonthlyRevenue,
  getTotalRevenueAfter,
  getTotalRevenueBefore,
} from '@/lib/actions/order';
import React from 'react';
import TotalRevenuChartDetails from './TotalRevenueChartDetails';

const TotalRevenueChart = async () => {
  const [monthlyRevenueData, totalRevenueBefore, totalRevenueAfter] =
    await Promise.all([
      getMonthlyRevenue(),
      getTotalRevenueBefore(),
      getTotalRevenueAfter(),
    ]);

  return (
    <TotalRevenuChartDetails
      monthlyRevenue={monthlyRevenueData}
      totalRevenueBefore={totalRevenueBefore}
      totalRevenueAfter={totalRevenueAfter}
    />
  );
};

export default TotalRevenueChart;
