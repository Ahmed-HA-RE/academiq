import ApplicationDataTable from '@/app/components/admin/Application/ApplicationDataTable';
import { getAllInstructorApplications } from '@/lib/actions/instructor';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Applications',
  description: 'Manage and view all applications in the admin dashboard',
};

const ApplicationsPage = async () => {
  const { applications } = await getAllInstructorApplications();

  return <ApplicationDataTable applications={applications} />;
};

export default ApplicationsPage;
