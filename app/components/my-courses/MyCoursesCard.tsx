import { Card, CardTitle } from '../ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpenText, Clock4 } from 'lucide-react';
import CourseUserProgress from '../shared/CourseUserProgress';
import { Button } from '../ui/button';
import { getUserCourseProgress } from '@/lib/actions/my-course/getMyCourse';
import { getTotalLessonsCount } from '@/lib/actions/my-course/course-content';
import { MyCoursesCardType } from '@/types';
import { Suspense } from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

const MyCoursesCard = async ({ course }: { course: MyCoursesCardType }) => {
  const [userProgress, lessonsCount] = await Promise.all([
    getUserCourseProgress(course.id),
    getTotalLessonsCount(course.id),
  ]);

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

  return (
    <Card className='p-0 sm:flex-row gap-0 hover:shadow-lg transition-all duration-300 overflow-hidden border-border/50'>
      {/* Left Side - Image */}
      <div className='sm:w-2/5 h-48 sm:h-auto relative'>
        <Image
          src={course.image}
          alt={course.title}
          fill
          sizes='(max-width: 640px) 100vw, 40vw'
          className='object-cover'
        />
      </div>

      {/* Right Side - Content */}
      <div className='sm:w-3/5 flex flex-col justify-between p-5'>
        {/* Top Section */}
        <div className='space-y-3'>
          <CardTitle className='font-semibold text-lg line-clamp-2'>
            {course.title}
          </CardTitle>

          {/* Instructor */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Avatar className='size-6 rounded-full'>
                <Suspense
                  fallback={
                    <AvatarFallback className='text-xs'>
                      {course.instructor.user.name.charAt(0)}
                    </AvatarFallback>
                  }
                >
                  <Image
                    src={course.instructor.user.image}
                    alt={course.instructor.user.name}
                    width={24}
                    height={24}
                    className='rounded-full object-cover'
                  />
                </Suspense>
              </Avatar>
              <span className='text-xs text-muted-foreground'>
                {course.instructor.user.name}
              </span>
            </div>
            {/* Course Stats */}
            <div className='flex flex-wrap items-center gap-3'>
              <span className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <span className='bg-muted p-1.5 rounded-md'>
                  <BookOpenText size={14} />
                </span>
                {lessonsCount} {lessonsCount === 1 ? 'Lesson' : 'Lessons'}
              </span>
              <span className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <span className='bg-muted p-1.5 rounded-md'>
                  <Clock4 size={14} />
                </span>
                {formatCourseDuration}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section - Progress & Button */}
        <div className='space-y-3 mt-4'>
          <CourseUserProgress userProgress={userProgress} />

          <Button
            className='w-full bg-gradient-to-r from-blue-500 to-sky-700 hover:from-blue-600 hover:to-sky-600 text-white transition cursor-pointer duration-300'
            size='sm'
            asChild
          >
            <Link
              href={`/my-courses/${course.slug}/${course.sections[0].id}/${course.sections[0].lessons[0].id}`}
            >
              {Number(userProgress.progress) === 0
                ? 'Start Learning'
                : 'Continue Learning'}
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MyCoursesCard;
