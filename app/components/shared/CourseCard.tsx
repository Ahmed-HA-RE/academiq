import { StarIcon } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/card';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Cart, Course, User } from '@/types';
import Image from 'next/image';
import { Button } from '../ui/button';
import { MotionPreset } from '../ui/motion-preset';
import EnrollCourseBtn from './EnrollCourseBtn';
import CourseProgression from './CourseProgression';
import { getUserProgress } from '@/lib/actions/user';

type CourseCardProps = {
  course: Course;
  cart: Cart | undefined;
  user: User | undefined;
};

const CourseCard = async ({ course, cart, user }: CourseCardProps) => {
  const isCourseOwened = user && user.courses?.some((c) => c.id === course.id);
  const useProgress = await getUserProgress(course.id);

  return (
    <MotionPreset
      component='div'
      fade
      slide={{ direction: 'up', offset: 50 }}
      blur
      transition={{ duration: 0.4 }}
      delay={0.3}
    >
      <Card className='h-full shadow-none gap-4 py-0 pt-6 pb-4 relative'>
        <CardContent className='flex flex-1 flex-col gap-6'>
          <div className='relative shrink-0 overflow-hidden rounded-md'>
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
          <Badge className='absolute top-4 left-3 rounded-sm bg-emerald-500 text-white focus-visible:ring-emerald-600/20 focus-visible:outline-none dark:bg-emerald-500/60 dark:focus-visible:ring-emerald-500/40'>
            {course.difficulty}
          </Badge>
          <div className='flex flex-col gap-0'>
            <div className='flex flex-1 flex-col gap-4'>
              <h3 className='text-xl font-medium'>{course.title}</h3>
              <div className='flex items-center gap-3'>
                <Badge className='rounded-sm bg-amber-400 text-white focus-visible:ring-amber-600/20 focus-visible:outline-none dark:bg-amber-400/60 dark:focus-visible:ring-amber-400/40'>
                  <StarIcon className='size-3' />
                  {course.rating}
                </Badge>
                <span className='text-muted-foreground font-medium underline'>
                  {course.numReviews} Reviews
                </span>
              </div>
            </div>

            <div className='flex flex-row items-center gap-1 font-semibold mt-4'>
              <span className='dirham-symbol !text-xl'>&#xea;</span>
              <span className='text-2xl'>{course.price}</span>
            </div>
            {isCourseOwened && <CourseProgression userProgress={useProgress} />}
          </div>
        </CardContent>
        <CardFooter className='items-end justify-end gap-2'>
          <Button
            asChild
            className='cursor-pointer'
            size={'sm'}
            variant={'outline'}
          >
            <Link href={`/course/${course.slug}`}>Read More</Link>
          </Button>
          <EnrollCourseBtn course={course} cart={cart} user={user} />
        </CardFooter>
      </Card>
    </MotionPreset>
  );
};

export default CourseCard;
