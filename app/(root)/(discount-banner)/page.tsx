import CTA from '../../components/CTA';
import Features from '../../components/Features';
import HeroSection from '../../components/HeroSection';
import Testimonial from '../../components/Testimonial';
import { Suspense } from 'react';
import SkeletonCard from '../../components/SkeletonCard';

const HomePage = async () => {
  return (
    <>
      <HeroSection />
      <Suspense
        fallback={
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 container section-spacing'>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        }
      ></Suspense>
      <Features />
      <Testimonial />
      <CTA />
    </>
  );
};

export default HomePage;
