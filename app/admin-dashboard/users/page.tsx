import UserDatatable from '@/app/components/admin/UserDataTable';
import { getAllUsers } from '@/lib/actions/user';
import { loadSearchParams } from '@/lib/searchParams';
import { SearchParams } from 'nuqs/server';

type AdminUsersPageProps = {
  searchParams: Promise<SearchParams>;
};

const AdminUsersPage = async ({ searchParams }: AdminUsersPageProps) => {
  const { q, page, role, status } = await loadSearchParams(searchParams);

  const { users, totalPages } = await getAllUsers({
    limit: 20,
    page,
    q: q,
    role: role,
    status: status,
  });

  return <UserDatatable users={users} totalPages={totalPages} />;
};

export default AdminUsersPage;
