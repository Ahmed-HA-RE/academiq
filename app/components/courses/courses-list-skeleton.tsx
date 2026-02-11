'use client';

import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

const CoursesListSkeleton = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {Array.from({ length: 9 }).map((_, index) => (
        <Card className='pt-0 pb-4 overflow-hidden gap-2' key={index}>
          <CardHeader className='p-0 relative'>
            {/* Course Image Skeleton */}
            <Skeleton className='w-full h-54 rounded-t-md' />
            {/* Badge Skeleton */}
            <Skeleton className='absolute top-4 left-3 h-5 w-20 rounded-sm' />
          </CardHeader>
          <CardContent className='px-4'>
            <div className='flex flex-col gap-4'>
              {/* Course Title Skeleton */}
              <Skeleton className='h-6 w-4/5' />

              {/* Instructor Info Skeleton */}
              <div className='flex items-center gap-2'>
                <Skeleton className='size-8 rounded-full' />
                <Skeleton className='h-4 w-32' />
              </div>

              {/* Description Skeleton */}
              <div className='space-y-2'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-3/4' />
              </div>

              {/* Price Skeleton */}
              <Skeleton className='h-6 w-24' />
            </div>
          </CardContent>
          <CardFooter className='grid grid-cols-2 gap-2 mt-2 px-3'>
            {/* Button Skeletons */}
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CoursesListSkeleton;
