import { MotionPreset } from '@/app/components/ui/motion-preset';
import { BounceButton } from '@/app/components/ui/bounce-button';
import { BookOpen, Users, GraduationCap } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import { getTotalCoursesCount } from '@/lib/actions/course/getCourses';
import { getCoursesWithStudents } from '@/lib/actions/course/getCourses';
import { getInstructorsCount } from '@/lib/actions/instructor/getInstructor';

const HeroSection = async () => {
  const [coursesCount] = await Promise.all([
    getTotalCoursesCount(),
    // getCoursesWithStudents(), // for testing purposes will only use static numbers
    // getInstructorsCount(), // for testing purposes will only use static numbers
  ]);

  const stats = [
    {
      label: 'Courses',
      value: coursesCount,
      icon: BookOpen,
    },
    {
      label: 'Students',
      value: '5k+',
      icon: Users,
    },
    {
      label: 'Instructors',
      value: '50+',
      icon: GraduationCap,
    },
  ];

  return (
    <section className='overflow-hidden py-8 sm:py-16 lg:py-24'>
      <div className='container'>
        <div className='relative grid gap-8 sm:gap-12 lg:gap-14 lg:grid-cols-5'>
          <div className='flex flex-col gap-6 lg:col-span-3'>
            <MotionPreset
              fade
              slide={{ offset: 50 }}
              blur
              transition={{ duration: 0.5 }}
              delay={0.3}
            >
              <h1 className='max-w-2xl text-4xl leading-[1.29167] font-bold sm:text-5xl lg:text-6xl '>
                Where Learning Turns Into Real Progress
              </h1>
            </MotionPreset>
            <MotionPreset
              fade
              slide={{ offset: 50 }}
              blur
              transition={{ duration: 0.5 }}
              delay={0.5}
            >
              <p className='text-muted-foreground text-lg max-w-xl'>
                In today&apos;s fast changing tech world, growing means learning
                with purpose. We&apos;re here to help you master practical
                skills, gain real confidence, and move forward at your own pace.
                From fundamentals to advanced topics, every course is built to
                turn effort into real progress.
              </p>
            </MotionPreset>
            <MotionPreset
              component='div'
              fade
              slide={{ offset: 50 }}
              blur
              transition={{ duration: 0.5 }}
              delay={0.7}
              className='space-x-4'
            >
              <BounceButton size={'lg'} className=' rounded-full px-6'>
                <Link href='/courses'>View Courses</Link>
              </BounceButton>
              <BounceButton
                size={'lg'}
                className='rounded-full px-6 bg-lime-500 dark:bg-lime-600 hover:bg-0 text-white hover:text-white'
              >
                <Link href='/about'>Learn More</Link>
              </BounceButton>
            </MotionPreset>
          </div>
          <MotionPreset
            component='div'
            fade
            slide={{ direction: 'right', offset: 50 }}
            blur
            transition={{ duration: 0.5 }}
            delay={0.5}
            className='aspect-square w-full max-w-md mx-auto rounded-full overflow-hidden shadow-lg lg:col-span-2'
          >
            <Image
              src='/images/hero-section.jpg'
              width={0}
              height={0}
              sizes='100vw'
              fill
              alt='Hero Image'
              className='object-cover size-full'
            />
          </MotionPreset>
        </div>
      </div>
      <div className='bg-gradient-to-r from-[#57ebde] to-[#AEFB2A] dark:bg-gradient-to-r dark:from-[#2B4584] dark:to-[#4A9E48] w-full p-4 mt-6'>
        <div className='container'>
          <div className='flex flex-row justify-between items-center gap-6'>
            {stats.map((stat, index) => (
              <MotionPreset
                key={index}
                fade
                slide={{ direction: 'up', offset: 30 }}
                transition={{ duration: 0.5 }}
                delay={0.2 + index * 0.2}
                className='flex flex-col items-center gap-2'
              >
                <div className='bg-white/90 dark:bg-white/10 rounded-full w-19 h-19 flex items-center justify-center shadow-sm'>
                  <stat.icon className='text-gradient-from-to size-9' />
                </div>
                <div className='flex flex-col items-center'>
                  <span className='text-4xl font-bold text-white dark:text-[#D1F3C4]'>
                    {stat.value}
                  </span>
                  <span className='text-white/85 dark:text-[#BFDFA8] text-base'>
                    {stat.label}
                  </span>
                </div>
              </MotionPreset>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
