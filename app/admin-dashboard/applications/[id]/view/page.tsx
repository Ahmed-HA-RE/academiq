import ViewApplicationDetails from '@/app/components/admin/Application/ViewApplicationDetails';
import { getApplicationById } from '@/lib/actions/instructor/application';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'View Application',
  description: 'View instructor application details',
};

const ViewApplicationPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const application = await getApplicationById(id);

  return <ViewApplicationDetails application={application} />;
};

export default ViewApplicationPage;
