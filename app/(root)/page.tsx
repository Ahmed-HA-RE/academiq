import CTA from '../components/CTA';
import FeaturedCourses from '../components/courses/FeaturedCourses';
import Features from '../components/Features';
import HeroSection from '../components/HeroSection';
import Testimonial from '../components/Testimonial';
import { getTotalCoursesCount } from '@/lib/actions/course';
import { getCoursesWithStudents } from '@/lib/actions/user';

const HomePage = async () => {
  const coursesCount = await getTotalCoursesCount();
  const studentsCount = await getCoursesWithStudents();

  return (
    <>
      <HeroSection coursesCount={coursesCount} studentsCount={studentsCount} />
      <FeaturedCourses />
      <Features />
      <Testimonial />
      <CTA />
    </>
  );
};

export default HomePage;
