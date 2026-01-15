import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { getPopularCoursesByInstructor } from '@/lib/actions/instructor/analytics';
import Image from 'next/image';
import Link from 'next/link';
import { FileChartPieIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';

const PopularCoursesCard = async () => {
  const popularCourses = await getPopularCoursesByInstructor();

  return (
    <Card className='gap-5 col-span-4 lg:col-span-2'>
      <CardHeader className='flex justify-between'>
        <span className='text-lg font-semibold'>Popular Courses</span>
        <span className='text-muted-foreground text-sm'>Your Top courses</span>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col gap-5'>
        {popularCourses.length === 0 ? (
          <div className='flex w-full flex-col items-center justify-center gap-3 px-4 text-center mt-4 h-full'>
            <FileChartPieIcon className='size-6 text-primary' />

            <span className='text-lg font-semibold'>
              No popular courses yet
            </span>
            <p className='text-muted-foreground text-sm max-w-[20rem]'>
              Courses that have been enrolled by many students will appear here.
              Create a course if you didn&apos;t yet.
            </p>
            <div className='mt-2 flex gap-2'>
              <Button asChild>
                <Link href='/instructor-dashboard/courses/new'>
                  Create Course
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          popularCourses.map((course, index) => (
            <div
              key={index}
              className='flex sm:flex-row flex-col sm:items-center justify-between gap-2'
            >
              <div className='flex items-center gap-2'>
                <div className='max-w-[80px]'>
                  <Link
                    href={`/instructor-dashboard/courses/${course.slug}/view`}
                  >
                    <Image
                      src={course.image}
                      alt={course.title}
                      width={0}
                      height={0}
                      sizes='100vw'
                      className='rounded-md w-full object-cover hover:scale-105 transition'
                    />
                  </Link>
                </div>
                <div className='flex flex-col min-w-0 gap-0.5'>
                  <span className='font-medium truncate'>{course.title}</span>
                  <div className='flex flex-row items-center gap-1 font-medium text-xs text-muted-foreground'>
                    <span className='dirham-symbol'>&#xea;</span>
                    <span className='font-semibold'>{course.price}</span>
                  </div>
                </div>
              </div>
              <span className='text-muted-foreground text-sm self-end sm:self-center'>
                {course._count.users} Students
              </span>
              {index !== popularCourses.length - 1 && (
                <Separator className='sm:hidden mt-4 mb-0 ' />
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default PopularCoursesCard;
