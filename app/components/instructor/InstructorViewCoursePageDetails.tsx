'use client';

import { Course, Section } from '@/types';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Clock, Clock3Icon, Globe2Icon, PencilLine } from 'lucide-react';
import { MdOutlineSignalCellularAlt } from 'react-icons/md';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { BiCategory } from 'react-icons/bi';
import DOMPurify from 'isomorphic-dompurify';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

const InstructorViewCoursePageDetails = ({
  course,
}: {
  course: Course & { sections: Section };
}) => {
  const courseDuration = course.sections
    .map((section) =>
      section.lessons
        .map((lesson) => lesson.duration)
        .reduce((a, b) => a + b, 0),
    )
    .reduce((a, b) => a + b, 0);

  dayjs.extend(duration);

  const parseCourseDuration = dayjs.duration(courseDuration, 'minute');

  const formatCourseDuration =
    courseDuration < 60
      ? `${parseCourseDuration.minutes()} min`
      : `${parseCourseDuration.hours()} hr ${parseCourseDuration.minutes()} min`;

  const lessonDuration = (duration: number) => {
    const parseLessonDuration = dayjs.duration(duration, 'minute');
    const formatLessonDuration =
      Number(duration) < 60
        ? `${parseLessonDuration.minutes()} min`
        : `${parseLessonDuration.hours()} hr ${parseLessonDuration.minutes()} min`;
    return formatLessonDuration;
  };

  return (
    <div className='space-y-8'>
      {/* Course Image */}
      <div className='relative'>
        <Image
          src={course.image}
          alt={course.title}
          width={0}
          height={0}
          sizes='100vw'
          className='w-full rounded-md'
        />
        <Button
          className='absolute top-4 right-4 cursor-pointer text-xs'
          asChild
        >
          <Link href={`/instructor-dashboard/courses/${course.slug}/edit`}>
            <PencilLine className='size-3' />
            Edit Course
          </Link>
        </Button>
      </div>
      {/* Course Info */}
      <div className='space-y-6'>
        <h2 className='text-3xl font-medium'>Node.js API Development</h2>
        <span className='flex flex-wrap items-center gap-x-10 gap-y-4 max-w-lg'>
          {/* Price */}
          <div className='flex flex-row items-center gap-1 text-muted-foreground'>
            <span className='dirham-symbol !text-md'>&#xea;</span>
            <span className='text-md'>{course.price}</span>
          </div>
          {/* Difficulty */}
          <div className='flex flex-row items-center gap-2'>
            <MdOutlineSignalCellularAlt
              className={cn(
                'size-5',
                course.difficulty === 'INTERMEDIATE'
                  ? 'text-red-500'
                  : course.difficulty === 'BEGINNER'
                    ? 'text-green-500'
                    : 'text-yellow-500',
              )}
            />
            <span className='text-md text-muted-foreground'>
              {course.difficulty.charAt(0) +
                course.difficulty.slice(1).toLowerCase()}
            </span>
          </div>
          {/* Course Duration */}
          <div className='flex flex-row items-center gap-2'>
            <Clock3Icon className='size-5 text-muted-foreground' />
            <span className='text-md text-muted-foreground'>
              {formatCourseDuration}
            </span>
          </div>
          {/* Course Language */}
          <div className='flex flex-row items-center gap-2'>
            <Globe2Icon className='size-5 text-muted-foreground' />
            <span className='text-md text-muted-foreground'>
              {course.language}
            </span>
          </div>
          {/* Course Category */}
          <div className='flex flex-row items-center gap-2'>
            <BiCategory className='size-5 text-muted-foreground' />
            <span className='text-md text-muted-foreground'>
              {course.category}
            </span>
          </div>
        </span>
        {/* Course Short Description */}
        <div className='space-y-2.5'>
          <h4 className='font-semibold'>Short Description</h4>
          <p className='text-md text-muted-foreground text-sm'>
            {course.shortDesc}
          </p>
        </div>
        {/* Course  Description */}
        <div className='space-y-2.5'>
          <h4 className='font-semibold'>Description</h4>
          <p
            className='text-md text-muted-foreground text-sm'
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(course.description),
            }}
          />
        </div>

        {/* Course Content */}
        <div className='space-y-4'>
          <h4 className='font-semibold mb-4'>Course Content</h4>
          <Accordion type='multiple' className='space-y-3'>
            {course.sections.map((section, index) => (
              <AccordionItem
                value={section.id}
                className='bg-white dark:bg-muted rounded-xl border border-gray-200 last:border-b dark:border-muted overflow-hidden'
                key={section.id}
              >
                <AccordionTrigger className='cursor-pointer px-6 py-4 text-base font-semibold hover:no-underline hover:bg-transparent transition-colors [&>svg]:size-5 [&>svg]:text-blue-500 dark:[&>svg]:text-amber-500'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-amber-500 text-blue-600 dark:text-white text-sm font-bold'>
                      {index + 1}
                    </div>
                    <span className='text-gray-900 dark:text-white'>
                      {section.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className='px-6'>
                  <div className='space-y-2 pt-2'>
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lesson.id}
                        className='flex items-center justify-between py-3 px-4 rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 transition-all duration-200 group'
                      >
                        <div className='flex items-center gap-3 flex-1 min-w-0'>
                          <span className='font-medium text-base text-gray-700 dark:text-gray-300 truncate'>
                            {lessonIndex + 1}. {lesson.title}
                          </span>
                        </div>
                        <div className='flex items-center gap-1.5 text-gray-500 dark:text-gray-400  ml-4 flex-shrink-0'>
                          <Clock className='size-5' />
                          <span className='font-medium text-base'>
                            {lessonDuration(lesson.duration)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default InstructorViewCoursePageDetails;
