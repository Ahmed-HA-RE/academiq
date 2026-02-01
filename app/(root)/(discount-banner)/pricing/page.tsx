import Pricing from '@/app/components/pricing/pricing';
import PricingFaq from '@/app/components/pricing/pricing-faq';
import { getCurrentLoggedUser } from '@/lib/actions/getUser';
import { listUserSubscription } from '@/lib/actions/subscription/list-user-subscription';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Choose the plan that gives you access to all courses, learning resources, and community support to grow your skills.',
};

const PricingPage = async () => {
  const [userSubscription, user] = await Promise.all([
    listUserSubscription(),
    getCurrentLoggedUser(),
  ]);

  return (
    <>
      <Pricing userSubscription={userSubscription} user={user} />
      <PricingFaq />
    </>
  );
};

export default PricingPage;
