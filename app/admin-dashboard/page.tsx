import TotalRevenueChart from '../components/admin/TotalRevenueChart';
import StatisticsCard from '../components/admin/StatisticsCard';
import { loadSearchParams } from '@/lib/searchParams';
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
  getAllUsers,
} from '@/lib/actions/user';
import OrdersChart from '@/app/components/admin/OrdersChart';
import UserDatatable from '../components/admin/UserDataTable';
import { SearchParams } from 'nuqs/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Overview of administrative statistics and user management',
};

type AdminDashboardHomePageProps = {
  searchParams: Promise<SearchParams>;
};

const AdminDashboardHomePage = async ({
  searchParams,
}: AdminDashboardHomePageProps) => {
  const { q, role, status, page } = await loadSearchParams(searchParams);

  const [
    monthlyRevenueData,
    totalRevenueBefore,
    totalRevenueAfter,
    newUsersCount,
    activeUsersCount,
    monthlyUserActivity,
    ordersMonthlyRevenue,
    { users, totalPages },
  ] = await Promise.all([
    await getMonthlyRevenue(),
    await getTotalRevenueBefore(),
    await getTotalRevenueAfter(),
    await getNewUsersCount(),
    await getActiveUsersCount(),
    await getMonthlyUserActivity(),
    await getOrdersMonthlyRevenue(),
    await getAllUsers({ limit: 5, q, role, status, page }),
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
      <UserDatatable users={users} totalPages={totalPages} />
    </>
  );
};

export default AdminDashboardHomePage;
