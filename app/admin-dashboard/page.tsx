import TotalRevenueChart from '../components/admin/TotalRevenueChart';
import StatisticsCard from '../components/admin/StatisticsCard';
import {
  getMonthlyRevenue,
  getTotalRevenueAfter,
  getTotalRevenueBefore,
} from '@/lib/actions/order';
import UsersChart from '../components/admin/UsersChart';
import {
  getActiveUsersCount,
  getNewUsersCount,
  getMonthlyUserActivity,
} from '@/lib/actions/user';

const AdminDashboardHomePage = async () => {
  const monthlyRevenueData = await getMonthlyRevenue();
  const totalRevenueBefore = await getTotalRevenueBefore();
  const totalRevenueAfter = await getTotalRevenueAfter();
  const newUsersCount = await getNewUsersCount();
  const activeUsersCount = await getActiveUsersCount();
  const monthlyUserActivity = await getMonthlyUserActivity();

  return (
    <>
      <StatisticsCard />
      <TotalRevenueChart
        monthlyRevenue={monthlyRevenueData}
        totalRevenueBefore={totalRevenueBefore}
        totalRevenueAfter={totalRevenueAfter}
      />
      <UsersChart
        monthlyUserActivity={monthlyUserActivity}
        newUsersCount={newUsersCount}
        activeUsersCount={activeUsersCount}
      />
    </>
  );
};

export default AdminDashboardHomePage;
