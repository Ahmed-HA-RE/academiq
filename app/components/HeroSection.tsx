import { MotionPreset } from '@/app/components/ui/motion-preset';
import { BounceButton } from '@/app/components/ui/bounce-button';

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

  return (
    <section className='overflow-hidden py-8 sm:py-16 lg:py-24 bg-gradient-to-r from-[#F9F5F0] to-[#FFF8E7] dark:from-[#000000] dark:to-[#111827]'>
      <div className='container'>
        <div className='relative grid gap-12 lg:grid-cols-5'>
          <div className='flex flex-col gap-6 lg:col-span-3'>
            <MotionPreset
              fade
              slide={{ offset: 50 }}
              blur
              transition={{ duration: 0.5 }}
              delay={0.3}
            >
              <h1 className='max-w-3xl text-3xl leading-[1.29167] font-bold sm:text-4xl lg:text-5xl '>
                Empowering Learners for Real Growth
              </h1>
            </MotionPreset>
            <MotionPreset
              fade
              slide={{ offset: 50 }}
              blur
              transition={{ duration: 0.5 }}
              delay={0.5}
            >
              <p className='text-muted-foreground text-lg'>
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
              className='space-x-6'
            >
              <BounceButton size={'lg'} className='text-base rounded-sm px-4'>
                <Link href='/courses'>View Courses</Link>
              </BounceButton>
              <BounceButton
                size={'lg'}
                variant={'outline'}
                className='text-base rounded-sm px-4 border-black dark:border-white'
              >
                <Link href='/about'>Learn More</Link>
              </BounceButton>
            </MotionPreset>
            <MotionPreset
              component='div'
              fade
              slide={{ offset: 50 }}
              blur
              transition={{ duration: 0.5 }}
              delay={0.8}
              className='flex items-center gap-8'
            >
              <div className='flex flex-col'>
                <span className='text-2xl font-medium'>{coursesCount}+</span>
                <span className='text-muted-foreground'>Courses</span>
              </div>
              <div className='flex flex-col'>
                <span className='text-2xl font-medium'>5k+</span>
                <span className='text-muted-foreground'>Students</span>
              </div>
              <div className='flex flex-col'>
                <span className='text-2xl font-medium'>50+</span>
                <span className='text-muted-foreground'>Instructors</span>
              </div>
            </MotionPreset>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-3 lg:max-w-184'>
              <MotionPreset
                component='div'
                fade
                slide={{ direction: 'down', offset: 50 }}
                blur
                transition={{ duration: 0.5 }}
                delay={0.9}
                className='bg-[#FFF8E7] dark:bg-muted group relative h-39 overflow-hidden rounded-md p-3'
              >
                <span className='text-muted-foreground text-xl font-medium'>
                  Learn at Your Pace
                </span>
                <div className='text-muted-foreground absolute end-5.5 -bottom-0.5 transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:scale-110 group-hover:drop-shadow-sm'>
                  <Image
                    src='https://res.cloudinary.com/ahmed--dev/image/upload/v1765042923/book_kyjyql.svg'
                    alt='book'
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='w-20 opacity-50 object-cover dark:hidden'
                  />
                  <Image
                    src='https://res.cloudinary.com/ahmed--dev/image/upload/v1765042923/book-white_kh0nzr.svg'
                    alt='book'
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='w-20 opacity-50 object-cover dark:block hidden'
                  />
                </div>
              </MotionPreset>
              <MotionPreset
                component='div'
                fade
                slide={{ direction: 'down', offset: 50 }}
                blur
                transition={{ duration: 0.5 }}
                delay={1.0}
                className='bg-[#FFF8E7] dark:bg-muted group relative h-39 overflow-hidden rounded-md p-3'
              >
                <span className='text-muted-foreground text-xl font-medium'>
                  Certified Instructors
                </span>

                <div className='absolute end-1 -bottom-2 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110 group-hover:drop-shadow-sm'>
                  <Image
                    src='https://res.cloudinary.com/ahmed--dev/image/upload/v1769174650/twy9aawdkrqrouhxxqnd.png'
                    alt='teacher'
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='w-20 opacity-50 object-cover dark:hidden'
                  />
                  <Image
                    src='https://res.cloudinary.com/ahmed--dev/image/upload/v1769174812/hqspm6sbzjkfm95nquxk.png'
                    alt='teacher'
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='w-20 opacity-50 object-cover dark:block hidden'
                  />
                </div>
              </MotionPreset>
              <MotionPreset
                component='div'
                fade
                slide={{ direction: 'down', offset: 50 }}
                blur
                transition={{ duration: 0.5 }}
                delay={1.1}
                className='bg-[#FFF8E7] dark:bg-muted group relative h-39 overflow-hidden rounded-md p-3'
              >
                <span className='text-muted-foreground text-xl font-medium'>
                  Interactive Learning
                </span>
                <div className='text-muted-foreground absolute end-5.5 -bottom-0.5 transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:scale-110 group-hover:drop-shadow-sm'>
                  <Image
                    src='https://res.cloudinary.com/ahmed--dev/image/upload/v1765044102/computer_jeza9o.svg'
                    alt='teacher'
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='w-20 opacity-50 object-cover dark:hidden'
                  />
                  <Image
                    src='https://res.cloudinary.com/ahmed--dev/image/upload/v1765044087/computer-svgrepo-com_nzu8bg.svg'
                    alt='teacher'
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='w-20 opacity-50  object-cover dark:block hidden'
                  />
                </div>
              </MotionPreset>
            </div>
          </div>
          <MotionPreset
            component='div'
            fade
            slide={{ direction: 'right', offset: 50 }}
            blur
            transition={{ duration: 0.5 }}
            delay={0.5}
            className='relative flex items-center md:items-start justify-center lg:col-span-2'
          >
            <Image
              src='/images/hero.jpg'
              width={0}
              height={0}
              sizes='100vw'
              alt='Hero Image'
              className='object-cover size-full max-sm:scale-120'
            />
          </MotionPreset>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
