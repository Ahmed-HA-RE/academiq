import Checklist from '@/app/components/teach/Checklist';
import CTASection from '@/app/components/teach/CTA';
import InstructorHero from '@/app/components/teach/InstructorHero';
import LeadingInstitutionsMarquee from '@/app/components/teach/leading-institutions-marquee';
import TeachFaq from '@/app/components/teach/TeachFaq';
import TeachFeatures from '@/app/components/teach/TeachFeatures';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Become an Instructor',
  description:
    'Join Academiq as an instructor and share your knowledge with a global audience. Create and sell courses on our platform.',
};

const BecomeAnInstructorPage = async () => {
  return (
    <>
      <InstructorHero />
      <LeadingInstitutionsMarquee />
      <TeachFeatures />
      <Checklist />
      <TeachFaq />
      <CTASection />
    </>
  );
};

export default BecomeAnInstructorPage;
