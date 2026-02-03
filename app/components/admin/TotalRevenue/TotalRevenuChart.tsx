import {
  getMonthlyRevenue,
  getTotalRevenueAfter,
  getTotalRevenueBefore,
} from '@/lib/actions/order/get-orders';
import TotalRevenuChartDetails from '../../shared/TotalRevenueChartDetails';

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
