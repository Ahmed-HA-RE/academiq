import { MotionPreset } from '@/app/components/ui/motion-preset';
import { BounceButton } from '@/app/components/ui/bounce-button';
import Link from 'next/link';
import Image from 'next/image';

const HeroSection = async () => {
  return (
    <section className='hero-section-spacing bg-secondary'>
      <div className='container'>
        <div className='bg-card-foreground rounded-xl px-8 py-8 md:py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center'>
          {/* Left side */}
          <div className='flex flex-col items-start gap-4 text-white'>
            <MotionPreset
              fade
              slide={{ offset: 50 }}
              blur
              transition={{ duration: 0.5 }}
              delay={0.5}
            >
              <h2 className='uppercase tracking-[6px] font-medium text-sm sm:text-base md:text-xl'>
                UNLOCK POTENTIAL
              </h2>
            </MotionPreset>
            <MotionPreset
              fade
              slide={{ offset: 50 }}
              blur
              transition={{ duration: 0.5 }}
              delay={0.5}
            >
              <h1 className='text-2xl md:text-5xl xl:text-6xl font-medium leading-snug lg:max-w-lg'>
                Knowledge Meets Innovation
              </h1>
            </MotionPreset>
            <MotionPreset
              fade
              slide={{ offset: 50 }}
              blur
              transition={{ duration: 0.5 }}
              delay={0.5}
            >
              <p className='text-base text-secondary max-w-lg'>
                Grow your knowledge, master the skills that matter, and take
                control of your learning journey.
              </p>
            </MotionPreset>
            <MotionPreset
              component='div'
              fade
              slide={{ offset: 50 }}
              blur
              transition={{ duration: 0.5 }}
              delay={0.7}
              className='space-x-4 mt-2'
            >
              <Link href='/courses'>
                <BounceButton
                  size={'default'}
                  className='bg-primary hover:bg-btn-primary-hover text-btn-primary-text cursor-pointer'
                >
                  View Courses
                </BounceButton>
              </Link>
              <Link href='/about'>
                <BounceButton
                  size={'default'}
                  className='bg-secondary hover:bg-0 text-primary cursor-pointer'
                >
                  Learn More
                </BounceButton>
              </Link>
            </MotionPreset>
          </div>
          {/* Right side */}
          <MotionPreset
            fade
            slide={{ offset: 50 }}
            blur
            transition={{ duration: 0.5 }}
            delay={0.5}
            className='overflow-hidden flex justify-center items-center'
          >
            <Image
              src='/images/home-hero.jpg'
              alt='Teenager holding books and backpack'
              className='object-cover w-full h-full rounded-xl'
              width={0}
              height={0}
              sizes='100vw'
              priority
            />
          </MotionPreset>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
