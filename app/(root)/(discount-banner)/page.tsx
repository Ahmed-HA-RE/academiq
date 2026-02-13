import LearningOutcomes from '@/app/components/LearningOutcomes';
import CTA from '../../components/CTA';
import Features from '../../components/Features';
import HeroSection from '../../components/HeroSection';
import Testimonial from '../../components/Testimonial';
import AboutIntro from '@/app/components/about/about-intro';
import Partners from '@/app/components/partners';

const HomePage = async () => {
  return (
    <>
      <HeroSection />
      <Partners />
      <Features />
      <LearningOutcomes />
      <AboutIntro />
      <Testimonial />
      <CTA />
    </>
  );
};

export default HomePage;
