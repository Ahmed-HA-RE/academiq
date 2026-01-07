import ViewApplicationDetails from '@/app/components/admin/Application/ViewApplicationDetails';
import { getApplicationById } from '@/lib/actions/instructor/application';
import stripe from '@/lib/stripe';
import { convertToPlainObject } from '@/lib/utils';
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
  const account = await stripe.accounts.retrieve(application.stripeAccountId);

  return (
    <ViewApplicationDetails
      application={application}
      account={convertToPlainObject(account)}
    />
  );
};

export default ViewApplicationPage;
