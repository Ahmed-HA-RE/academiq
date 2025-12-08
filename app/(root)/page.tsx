import CTA from '../components/CTA';
import FeaturedCourses from '../components/FeaturedCourses';
import Features from '../components/Features';
import HeroSection from '../components/HeroSection';
import Testimonial from '../components/Testimonial';

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <FeaturedCourses />
      <Features />
      <Testimonial />
      <CTA />
    </>
  );
};

export default HomePage;
