import TotalRevenueChart from '../components/admin/TotalRevenueChart';
import StatisticsCard from '../components/admin/StatisticsCard';
import {
  getMonthlyRevenue,
  getOrdersMonthlyRevenue,
  getTotalRevenueAfter,
  getTotalRevenueBefore,
} from '@/lib/actions/order';
import UsersChart from '../components/admin/UsersChart';
import {
  getActiveUsersCount,
  getNewUsersCount,
  getMonthlyUserActivity,
} from '@/lib/actions/user';
import OrdersChart from '@/app/components/admin/OrdersChart';

const AdminDashboardHomePage = async () => {
  const [
    monthlyRevenueData,
    totalRevenueBefore,
    totalRevenueAfter,
    newUsersCount,
    activeUsersCount,
    monthlyUserActivity,
    ordersMonthlyRevenue,
  ] = await Promise.all([
    await getMonthlyRevenue(),
    await getTotalRevenueBefore(),
    await getTotalRevenueAfter(),
    await getNewUsersCount(),
    await getActiveUsersCount(),
    await getMonthlyUserActivity(),
    await getOrdersMonthlyRevenue(),
  ]);

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
      <OrdersChart ordersMonthlyRevenue={ordersMonthlyRevenue} />
    </>
  );
};

export default AdminDashboardHomePage;
