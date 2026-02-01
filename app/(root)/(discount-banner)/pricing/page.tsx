import Pricing from '@/app/components/pricing/pricing';
import PricingFaq from '@/app/components/pricing/pricing-faq';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Choose the plan that gives you access to all courses, learning resources, and community support to grow your skills.',
};

const PricingPage = () => {
  return (
    <>
      <Pricing />
      <PricingFaq />
    </>
  );
};

export default PricingPage;
