import { getAllAdmins } from '@/lib/actions/admin/list-user';
import { loadSearchParams } from '@/lib/searchParams';
import { SearchParams } from 'nuqs/server';
import { Metadata } from 'next';
import AdminDataTable from '@/app/components/admin/AdminDataTable';

export const metadata: Metadata = {
  title: 'Admins',
  description: 'Manage admin users in the admin dashboard',
};

type AdminBanUsersPageProps = {
  searchParams: Promise<SearchParams>;
};

const AdminUsersPage = async ({ searchParams }: AdminBanUsersPageProps) => {
  const { page, q } = await loadSearchParams(searchParams);

  const { adminUsers, totalPages } = await getAllAdmins(q, page);

  return <AdminDataTable adminUsers={adminUsers} totalPages={totalPages} />;
};

export default AdminUsersPage;
