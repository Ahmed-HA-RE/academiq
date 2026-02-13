'use client';

import { CalendarRangeIcon, Clock3, Globe } from 'lucide-react';

import { Badge } from '@/app/components/ui/badge';
import { BorderBeam } from '@/app/components/ui/border-beam';
import { MotionPreset } from '@/app/components/ui/motion-preset';
import Image from 'next/image';
import { Course, Section, User } from '@/types';
import EnrollCourseBtn from '../shared/course-card-btn';
import { FaShieldAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import InstructorInfoDialog from './InstructorInfoDialog';
import { formatDuration } from '@/lib/utils';

type CourseTopSectionProps = {
  course: Course & { sections: Section[]; _count: { users: number } };
  user?: User;
};

const CourseTopSection = ({ course, user }: CourseTopSectionProps) => {
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
    <section className='pb-10 sm:pb-16 lg:pb-20 pt-32 sm:pt-36 lg:pt-40 bg-secondary'>
      <div className='container'>
        <div className='relative grid gap-8 xl:gap-24 lg:gap-16 lg:grid-cols-4'>
          <div className='flex flex-col gap-5 lg:col-span-2'>
            <MotionPreset
              fade
              zoom={{ initialScale: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              delay={0.1}
            >
              <Badge
                variant='outline'
                className='bg-primary/10 dark:bg-primary/20 text-primary relative px-3 py-1.5 font-normal border-0'
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
              <h1 className='max-w-3xl text-3xl font-bold sm:text-3xl lg:text-4xl text-primary'>
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
              <p className='text-secondary-foreground text-base'>
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
                  className='flex items-center gap-2 text-secondary-foreground'
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
                <EnrollCourseBtn course={course} user={user} />
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
            className='lg:col-span-2 w-full h-full'
          >
            <Image
              src={course.image}
              alt={course.title}
              width={0}
              height={0}
              sizes='100vw'
              loading='eager'
              className='w-full h-full max-lg:max-w-lg max-lg:mx-auto transition-all duration-300 hover:scale-105 rounded-md'
            />
          </MotionPreset>
        </div>
      </div>
    </section>
  );
};

export default CourseTopSection;
