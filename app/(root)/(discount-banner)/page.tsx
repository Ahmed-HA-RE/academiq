import CTA from '../../components/CTA';
import Features from '../../components/Features';
import HeroSection from '../../components/HeroSection';
import Testimonial from '../../components/Testimonial';

const HomePage = async () => {
  return (
    <>
      <HeroSection />
      <Features />
      <Testimonial />
      <CTA />
    </>
  );
};

export default HomePage;
