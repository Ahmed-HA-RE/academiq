import {
  getMonthlyRevenueForInstructor,
  getTotalRevenueBeforeForInstructor,
  getTotalRevenueAfterForInstructor,
} from '@/lib/actions/instructor/analytics';
import TotalRevenuChartDetails from '../shared/TotalRevenueChartDetails';

const TotalRevenueChart = async () => {
  const [monthlyRevenue, totalRevenueBefore, totalRevenueAfter] =
    await Promise.all([
      getMonthlyRevenueForInstructor(),
      getTotalRevenueBeforeForInstructor(),
      getTotalRevenueAfterForInstructor(),
    ]);

  return (
    <TotalRevenuChartDetails
      monthlyRevenue={monthlyRevenue}
      totalRevenueBefore={totalRevenueBefore}
      totalRevenueAfter={totalRevenueAfter}
    />
  );
};

export default TotalRevenueChart;
