import Checklist from '@/app/components/teacher/Checklist';
import TeacherHero from '@/app/components/teacher/TeacherHero';
import TeachFaq from '@/app/components/teacher/TeachFaq';
import TeachFeatures from '@/app/components/teacher/TeachFeatures';

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
