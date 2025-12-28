import CTA from '../components/CTA';
import FeaturedCourses from '../components/courses/FeaturedCourses';
import Features from '../components/Features';
import HeroSection from '../components/HeroSection';
import Testimonial from '../components/Testimonial';
import { getTotalCoursesCount } from '@/lib/actions/course';
import { getCoursesWithStudents } from '@/lib/actions/user';
import { Suspense } from 'react';
import SkeletonCard from '../components/SkeletonCard';

const HomePage = async () => {
  const [coursesCount, studentsCount] = await Promise.all([
    getTotalCoursesCount(),
    getCoursesWithStudents(),
  ]);

  return (
    <>
      <HeroSection coursesCount={coursesCount} studentsCount={studentsCount} />
      <Suspense
        fallback={
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 container'>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        }
      >
        <FeaturedCourses />
      </Suspense>
      <Features />
      <Testimonial />
      <CTA />
    </>
  );
};

export default HomePage;
