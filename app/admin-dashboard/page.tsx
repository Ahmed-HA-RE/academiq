import StatisticsCard from '../components/admin/StatisticsCard';
import { loadSearchParams } from '@/lib/searchParams';
import { getAllUsers } from '@/lib/actions/admin/list-user';
import { SearchParams } from 'nuqs/server';
import { Metadata } from 'next';
import TotalRevenueChart from '../components/admin/TotalRevenue/TotalRevenuChart';
import UserDatatable from '../components/admin/Users/UserDataTable';
import UsersChart from '../components/admin/Users/UsersChart';
import OrderChart from '../components/admin/Orders/OrderChart';

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

  const { users, totalPages } = await getAllUsers({
    limit: 5,
    q,
    role,
    status,
    page,
  });

  return (
    <>
      <StatisticsCard />
      <TotalRevenueChart />
      <UsersChart />
      <OrderChart />
      <UserDatatable users={users} totalPages={totalPages} />
    </>
  );
};

export default AdminDashboardHomePage;
