import Checklist from '@/app/components/teacher/Checklist';
import TeacherHero from '@/app/components/teacher/TeacherHero';
import TeachFaq from '@/app/components/teacher/TeachFaq';
import TeachFeatures from '@/app/components/teacher/TeachFeatures';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Become an Instructor',
  description:
    'Join Academiq as an instructor and share your knowledge with a global audience. Create and sell courses on our platform.',
};

const BecomeAnInstructorPage = () => {
  return (
    <>
      <TeacherHero />
      <TeachFeatures />
      <Checklist />
      <TeachFaq />
    </>
  );
};

export default BecomeAnInstructorPage;
