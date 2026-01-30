import AboutHeroSection from '@/app/components/about/about-hero-section';
import AboutOurMission from '@/app/components/about/about-our-mission';
import AboutOurTeam from '@/app/components/about/about-our-team';
import AboutOurStory from '@/app/components/about/our-story';
import { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our mission, vision, and values.',
};

const AboutPage = () => {
  return (
    <>
      <AboutHeroSection />
      <AboutOurStory />
      <AboutOurMission />
      <AboutOurTeam />
    </>
  );
};

export default AboutPage;
