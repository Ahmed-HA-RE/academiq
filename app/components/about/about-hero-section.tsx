import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import { MotionPreset } from '../ui/motion-preset';

const AboutHeroSection = () => {
  return (
    <section className='bg-secondary hero-section-spacing'>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-2 items-center gap-10 bg-foreground hero-container rounded-xl'>
          {/* Left Col */}
          <MotionPreset
            fade
            blur
            slide={{ direction: 'left' }}
            delay={0.1}
            transition={{ duration: 0.8 }}
          >
            <div className='space-y-3 md:space-y-4'>
              <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-wide z-20'>
                About {APP_NAME}
              </h1>
              <p className='text-secondary text-base sm:text-lg lg:text-xl max-w-2xl'>
                {APP_NAME} makes online learning simple and engaging. Connect
                with expert instructors, access interactive courses, and track
                your progress seamlessly all in one platform designed to help
                you learn, grow, and succeed.
              </p>
            </div>
          </MotionPreset>
          {/* Right Col */}
          <MotionPreset
            fade
            blur
            slide={{ direction: 'right' }}
            delay={0.1}
            transition={{ duration: 0.8 }}
          >
            <div className='flex justify-center lg:justify-end'>
              <Image
                src='/images/about/about-us-hero.jpg'
                alt='About Us'
                width={0}
                height={0}
                sizes='100vw'
                className='w-full max-w-md rounded-md object-cover'
              />
            </div>
          </MotionPreset>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
