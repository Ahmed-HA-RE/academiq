import Checklist from '@/app/components/teach/Checklist';
import CTASection from '@/app/components/teach/CTA';
import TeacherHero from '@/app/components/teach/TeacherHero';
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
      <TeacherHero />
      <TeachFeatures />
      <Checklist />
      <TeachFaq />
      <CTASection />
    </>
  );
};

export default BecomeAnInstructorPage;
