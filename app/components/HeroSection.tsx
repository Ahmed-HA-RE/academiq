import { MotionPreset } from '@/app/components/ui/motion-preset';
import { BounceButton } from '@/app/components/ui/bounce-button';

import Image from 'next/image';
import Link from 'next/link';
import { getTotalCoursesCount } from '@/lib/actions/course/getCourses';
import { getCoursesWithStudents } from '@/lib/actions/course/getCourses';

const HeroSection = async () => {
  const [coursesCount, studentsCount] = await Promise.all([
    getTotalCoursesCount(),
    getCoursesWithStudents(),
  ]);
  return (
    <section className='overflow-hidden section-spacing'>
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
              <h1 className='max-w-3xl text-3xl leading-[1.29167] font-bold sm:text-4xl lg:text-5xl'>
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
              className='flex flex-wrap md:justify-center items-center gap-6'
            >
              <BounceButton>
                <Link href='/courses'>View Courses</Link>
              </BounceButton>
              <div className='flex flex-col'>
                <span className='text-xl font-medium'>{coursesCount}+</span>
                <span className='text-muted-foreground'>Courses</span>
              </div>
              <div className='flex flex-col'>
                <span className='text-xl font-medium'>{studentsCount}+</span>
                <span className='text-muted-foreground'>Students Enrolled</span>
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
                className='bg-muted group relative h-39 overflow-hidden rounded-md p-3'
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
                className='bg-muted group relative h-39 overflow-hidden rounded-md p-3'
              >
                <span className='text-muted-foreground text-xl font-medium'>
                  Certified Instructors
                </span>
                <div className='text-muted-foreground absolute end-15.5 -bottom-0.5 transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:scale-115 group-hover:drop-shadow-sm'>
                  <div className='relative'>
                    <div className='text-muted-foreground absolute size-42 -translate-x-1/2 -translate-y-1/2 rounded-full border'></div>
                    <div className='text-muted-foreground absolute size-36 -translate-x-1/2 -translate-y-1/2 rounded-full border'></div>
                    <div className='text-muted-foreground absolute size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border'></div>
                    <div className='text-muted-foreground absolute size-20 -translate-x-1/2 -translate-y-1/2 rounded-full border'></div>
                  </div>
                </div>
                <div className='absolute end-1 -bottom-2 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110 group-hover:drop-shadow-sm'>
                  <Image
                    src='https://res.cloudinary.com/ahmed--dev/image/upload/v1765042923/teacher_g6dnkt.svg'
                    alt='teacher'
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='w-20 opacity-50 object-cover dark:hidden'
                  />
                  <Image
                    src='https://res.cloudinary.com/ahmed--dev/image/upload/v1765042923/teacher-white_asuicc.svg'
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
                className='bg-muted group relative h-39 overflow-hidden rounded-md p-3'
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
            className='relative flex items-center md:items-start justify-center  lg:col-span-2'
          >
            <Image
              src='https://res.cloudinary.com/ahmed--dev/image/upload/v1765132080/hero_fskl0d.jpg'
              alt='student'
              width={0}
              height={0}
              sizes='100vw'
              loading='eager'
              className='size-full max-h-[520px] max-w-md rounded-3xl object-cover'
            />
          </MotionPreset>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
