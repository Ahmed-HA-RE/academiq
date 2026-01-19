import { getBannedUsers } from '@/lib/actions/admin/list-user';
import { loadSearchParams } from '@/lib/searchParams';
import { SearchParams } from 'nuqs/server';
import { Metadata } from 'next';
import UserDatatable from '@/app/components/admin/Users/UserDataTable';

export const metadata: Metadata = {
  title: 'Banned Users',
  description: 'Manage banned users in the admin dashboard',
};

type AdminBanUsersPageProps = {
  searchParams: Promise<SearchParams>;
};

const AdminBanUsersPage = async ({ searchParams }: AdminBanUsersPageProps) => {
  const { page, q, status } = await loadSearchParams(searchParams);

  const { users: bannedUsers, totalPages } = await getBannedUsers({
    page,
    q,
    status,
    limit: 10,
  });

  return <UserDatatable users={bannedUsers} totalPages={totalPages} />;
};

export default AdminBanUsersPage;
