import InstructorDataTable from '@/app/components/admin/Instructor/InstructorDataTable';
import { getAllInstructorsAsAdmin } from '@/lib/actions/instructor/instructor';
import { loadSearchParams } from '@/lib/searchParams';
import { Metadata } from 'next';
import { SearchParams } from 'nuqs/server';

export const metadata: Metadata = {
  title: 'Instructors',
  description: 'Manage and view all instructors in the admin dashboard',
};

type AdminInstructorPageProps = {
  searchParams: Promise<SearchParams>;
};

const AdminInstructorsPage = async ({
  searchParams,
}: AdminInstructorPageProps) => {
  const { search, status, page } = await loadSearchParams(searchParams);

  const { instructors, totalPages } = await getAllInstructorsAsAdmin({
    search,
    status,
    page,
  });

  return (
    <InstructorDataTable instructors={instructors} totalPages={totalPages} />
  );
};

export default AdminInstructorsPage;
