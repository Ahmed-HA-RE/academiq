import ApplicationDataTable from '@/app/components/admin/Application/ApplicationDataTable';
import { getAllInstructorApplications } from '@/lib/actions/instructor';
import { loadSearchParams } from '@/lib/searchParams';
import { Metadata } from 'next';
import { SearchParams } from 'nuqs/server';

export const metadata: Metadata = {
  title: 'Applications',
  description: 'Manage and view all applications in the admin dashboard',
};

type ApplicationPageProps = {
  searchParams: Promise<SearchParams>;
};

const ApplicationsPage = async ({ searchParams }: ApplicationPageProps) => {
  const { page, search, submittedAt, status } =
    await loadSearchParams(searchParams);

  const { applications, totalPages } = await getAllInstructorApplications({
    page,
    search,
    submittedAt,
    status,
  });

  return (
    <ApplicationDataTable applications={applications} totalPages={totalPages} />
  );
};

export default ApplicationsPage;
