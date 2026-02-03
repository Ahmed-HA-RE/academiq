import Subscription from '@/app/components/shared/subscription';
import { listUserSubscription } from '@/lib/actions/subscription/list-user-subscription';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subscription',
  description: 'View and manage your subscription',
};

const InstructorSubscriptionPage = async () => {
  const subscription = await listUserSubscription();

  return (
    <div className='col-span-4'>
      <Subscription subscription={subscription} />
    </div>
  );
};

export default InstructorSubscriptionPage;
