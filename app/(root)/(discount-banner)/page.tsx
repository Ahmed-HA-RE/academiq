import LearningOutcomes from '@/app/components/LearningOutcomes';
import CTA from '../../components/CTA';
import Features from '../../components/Features';
import HeroSection from '../../components/HeroSection';
import Testimonial from '../../components/Testimonial';
import LogoCloud from '@/app/components/LogoCloud';

const HomePage = async () => {
  return (
    <>
      <HeroSection />
      <LogoCloud />
      <Features />
      <LearningOutcomes />
      <Testimonial />
      <CTA />
    </>
  );
};

export default HomePage;
