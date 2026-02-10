'use client';

import { CalendarRangeIcon, Clock3, Globe } from 'lucide-react';

import { Badge } from '@/app/components/ui/badge';
import { BorderBeam } from '@/app/components/ui/border-beam';
import { MotionPreset } from '@/app/components/ui/motion-preset';
import Image from 'next/image';
import { Course, Section, User } from '@/types';
import EnrollCourseBtn from '../shared/CourseCardBtn';
import { FaShieldAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import InstructorInfoDialog from './InstructorInfoDialog';
import { formatDuration } from '@/lib/utils';
import { useState } from 'react';

type CourseTopSectionProps = {
  course: Course & { sections: Section[]; _count: { users: number } };
  user?: User;
};

const CourseTopSection = ({ course, user }: CourseTopSectionProps) => {
  const [isPending, setIsPending] = useState(false);

  const courseDuration = course.sections
    .map((section) =>
      section.lessons
        .map((lesson) => lesson.duration)
        .reduce((a, b) => a + b, 0),
    )
    .reduce((a, b) => a + b, 0);

  const courseDetails = [
    { icon: <Clock3 />, label: formatDuration(courseDuration) },
    { icon: <Globe />, label: course.language },
    { icon: <FaShieldAlt className='size-5' />, label: course.difficulty },
    {
      icon: <CalendarRangeIcon />,
      label: `Last Updated on ${format(new Date(course.updatedAt), 'MMMM d, yyyy')}`,
    },
  ];

  return (
    <section className='flex-1 bg-blue-50 dark:bg-muted py-16 sm:py-18 lg:py-20'>
      <div className='mx-auto max-w-[1440px] flex h-full flex-col gap-12 px-4 sm:gap-16 sm:px-6 lg:px-8'>
        <div className='relative grid gap-8 xl:gap-24 lg:gap-16 xl:grid-cols-4'>
          <div className='flex flex-col gap-5 xl:col-span-2'>
            <MotionPreset
              fade
              zoom={{ initialScale: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              delay={0.1}
            >
              <Badge
                variant='outline'
                className='bg-blue-100 dark:bg-black/50 text-blue-500 dark:text-amber-500 relative px-3 py-1.5 font-normal border-0'
              >
                {course.category}
                <BorderBeam
                  colorFrom='indigo'
                  colorTo='sky'
                  size={35}
                  duration={8}
                />
              </Badge>
            </MotionPreset>
            <MotionPreset
              fade
              slide={{ direction: 'up', offset: 80 }}
              blur='8px'
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              delay={0.2}
            >
              <h1 className='max-w-3xl text-3xl font-bold sm:text-3xl lg:text-4xl text-blue-500 dark:text-amber-500'>
                {course.title}
              </h1>
            </MotionPreset>
            <MotionPreset
              fade
              slide={{ direction: 'up', offset: 60 }}
              blur='6px'
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              delay={0.4}
            >
              <p className='text-muted-foreground dark:text-white text-base'>
                {course.shortDesc}
              </p>
            </MotionPreset>
            <MotionPreset
              component='div'
              fade
              slide={{ direction: 'up', offset: 40 }}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
              delay={0.5}
              className='flex flex-wrap items-center gap-x-10 gap-y-5 my-2'
            >
              {courseDetails.map((detail, index) => (
                <div
                  key={index}
                  className='flex items-center gap-2 text-muted-foreground dark:text-white/90 '
                >
                  {detail.icon}
                  <h3 className='text-sm'>{detail.label}</h3>
                </div>
              ))}
            </MotionPreset>

            {/* Price  */}
            <div className='flex flex-row items-center justify-start gap-1'>
              <span className='dirham-symbol !text-2xl '>&#xea;</span>
              <span className='text-2xl'>{course.price}</span>
            </div>

            <div className='flex items-center gap-4'>
              <MotionPreset
                component='div'
                fade
                slide={{ direction: 'up', offset: 40 }}
                transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                delay={0.6}
                className='w-full max-w-[250px]'
              >
                <EnrollCourseBtn
                  course={course}
                  user={user}
                  isPending={isPending}
                  setIsPending={setIsPending}
                />
              </MotionPreset>
              <MotionPreset
                component='div'
                fade
                slide={{ direction: 'up', offset: 40 }}
                transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                delay={0.6}
                className='w-full max-w-[250px]'
              >
                <InstructorInfoDialog instructor={course.instructor} />
              </MotionPreset>
            </div>
          </div>
          <MotionPreset
            component='div'
            fade
            zoom={{ initialScale: 0.7 }}
            blur
            transition={{ duration: 0.4 }}
            delay={0.3}
            className='xl:col-span-2 w-full mx-auto'
          >
            <Image
              src={course.image}
              alt={course.title}
              width={0}
              height={0}
              sizes='100vw'
              loading='eager'
              className='w-full mx-auto sm:max-w-md transition-all duration-300 hover:scale-105 rounded-md'
            />
          </MotionPreset>
        </div>
      </div>
    </section>
  );
};

export default CourseTopSection;
