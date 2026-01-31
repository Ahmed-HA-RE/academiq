import LearningOutcomes from '@/app/components/LearningOutcomes';
import CTA from '../../components/CTA';
import Features from '../../components/Features';
import HeroSection from '../../components/HeroSection';
import Testimonial from '../../components/Testimonial';
import LogoCloud from '@/app/components/LogoCloud';
import AboutIntro from '@/app/components/about/about-intro';

const HomePage = async () => {
  return (
    <>
      <HeroSection />
      <Features />
      <LearningOutcomes />
      <LogoCloud />
      <AboutIntro />
      <Testimonial />
      <CTA />
    </>
  );
};

export default HomePage;
