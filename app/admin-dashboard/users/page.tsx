import { getAllUsers } from '@/lib/actions/user';
import { loadSearchParams } from '@/lib/searchParams';
import { SearchParams } from 'nuqs/server';
import { Metadata } from 'next';
import UserDatatable from '@/app/components/admin/Users/UserDataTable';

export const metadata: Metadata = {
  title: 'Users',
  description: 'Manage and view all users in the admin dashboard',
};

type AdminUsersPageProps = {
  searchParams: Promise<SearchParams>;
};

const AdminUsersPage = async ({ searchParams }: AdminUsersPageProps) => {
  const { q, page, role, status } = await loadSearchParams(searchParams);

  const { users, totalPages } = await getAllUsers({
    limit: 10,
    page,
    q: q,
    role: role,
    status: status,
  });

  return <UserDatatable users={users} totalPages={totalPages} />;
};

export default AdminUsersPage;
