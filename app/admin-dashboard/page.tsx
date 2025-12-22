import TotalRevenueChart from '../components/admin/TotalRevenueChart';
import StatisticsCard from '../components/admin/StatisticsCard';
import {
  getMonthlyRevenue,
  getTotalRevenueAfter,
  getTotalRevenueBefore,
} from '@/lib/actions/order';

const AdminDashboardHomePage = async () => {
  const monthlyRevenueData = await getMonthlyRevenue();
  const totalRevenueBefore = await getTotalRevenueBefore();
  const totalRevenueAfter = await getTotalRevenueAfter();

  return (
    <>
      <StatisticsCard />
      <TotalRevenueChart
        monthlyRevenue={monthlyRevenueData}
        totalRevenueBefore={totalRevenueBefore}
        totalRevenueAfter={totalRevenueAfter}
      />
    </>
  );
};

export default AdminDashboardHomePage;
