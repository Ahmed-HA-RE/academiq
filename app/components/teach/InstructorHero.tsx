'use client';
import { MotionPreset } from '@/app/components/ui/motion-preset';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/button';

const InstructorHero = () => {
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
                Teach. Inspire. Earn.
              </h2>
            </MotionPreset>
            <MotionPreset
              fade
              slide={{ offset: 50 }}
              blur
              transition={{ duration: 0.5 }}
              delay={0.5}
            >
              <h1 className='text-3xl md:text-4xl xl:text-5xl font-medium leading-snug lg:max-w-lg'>
                Share Your Expertise, Inspire Learners
              </h1>
            </MotionPreset>
            <MotionPreset
              fade
              slide={{ offset: 50 }}
              blur
              transition={{ duration: 0.5 }}
              delay={0.5}
            >
              <p className='text-base text-secondary lg:max-w-lg'>
                Transform your knowledge into impact. Create engaging courses,
                reach students worldwide, and earn while doing what you love.
                Join hundreds of instructors building the future of education.
              </p>
            </MotionPreset>
            <MotionPreset
              component='div'
              fade
              slide={{ offset: 50 }}
              blur
              transition={{ duration: 0.5 }}
              delay={0.7}
              className='mt-2 flex items-center justify-center w-full'
            >
              <Button
                asChild
                size={'lg'}
                className='bg-primary text-xs hover:bg-primary-hover text-btn-primary-text cursor-pointer w-full rounded-full'
              >
                <Link className='w-full' href='/teach/apply'>
                  Apply Now
                </Link>
              </Button>
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
              src='/images/teach-hero.jpg'
              alt='Instructor teaching online course'
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

export default InstructorHero;
