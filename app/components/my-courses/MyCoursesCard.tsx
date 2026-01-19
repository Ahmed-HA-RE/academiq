import { MotionPreset } from '../ui/motion-preset';
import { Card, CardContent, CardFooter } from '../ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpenIcon } from 'lucide-react';
import CourseProgression from '../shared/CourseProgression';
import { Button } from '../ui/button';
import {
  getTotalLessonsCount,
  getUserProgress,
} from '@/lib/actions/user/my-course';
import { MyCoursesCardType } from '@/types';

const MyCoursesCard = async ({ course }: { course: MyCoursesCardType }) => {
  const [userProgress, lessonsCount] = await Promise.all([
    getUserProgress(course.id),
    getTotalLessonsCount(course.id),
  ]);

  return (
    <MotionPreset
      component='div'
      key={course.id}
      fade
      slide={{ direction: 'up', offset: 50 }}
      blur
      transition={{ duration: 0.4 }}
      delay={0.3}
    >
      <Card className='h-full shadow-none gap-4 py-0 pt-6 pb-4 relative'>
        <CardContent className='flex flex-1 flex-col gap-6'>
          <div className='shrink-0 overflow-hidden rounded-md'>
            <Link href={`/course/${course.slug}`}>
              <Image
                src={course.image}
                alt={course.title}
                width={0}
                height={0}
                sizes='100vw'
                loading='eager'
                className='w-full max-h-[200px] object-cover hover:scale-105 transition duration-300 ease-in-out'
              />
            </Link>
          </div>
          <div className='flex flex-col gap-0'>
            <div className='flex flex-1 flex-col gap-4'>
              <h3 className='text-xl font-medium'>{course.title}</h3>

              <div className='flex flex-row items-center gap-2'>
                <div className='bg-blue-300/60 dark:bg-blue-300/90 p-1 rounded-full flex items-center justify-center'>
                  <BookOpenIcon
                    size={20}
                    className='text-blue-500 dark:text-blue-600'
                  />
                </div>
                <span className='text-muted-foreground'>
                  {lessonsCount} Lessons
                </span>
              </div>
            </div>
            <CourseProgression userProgress={userProgress} />
          </div>
        </CardContent>
        <CardFooter className='self-end'>
          <Button asChild>
            <Link href={`/my-courses/${course.slug}`}>Go to Course</Link>
          </Button>
        </CardFooter>
      </Card>
    </MotionPreset>
  );
};

export default MyCoursesCard;
