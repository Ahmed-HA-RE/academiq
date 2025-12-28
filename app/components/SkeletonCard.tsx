'use client';

import { Skeleton } from './ui/skeleton';
import { Card, CardContent, CardFooter } from './ui/card';

const SkeletonCard = () => {
  return (
    <Card className='h-full shadow-none gap-4 py-0 pt-6 pb-4 relative'>
      <CardContent className='flex flex-1 flex-col gap-6'>
        <div className='relative shrink-0 overflow-hidden rounded-md'>
          <Skeleton className='h-[200px] w-full rounded-md' />
          <div className='absolute top-4 left-3'>
            <Skeleton className='h-6 w-16 rounded-sm' />
          </div>
        </div>

        <div className='flex flex-col gap-0'>
          <div className='flex flex-1 flex-col gap-4'>
            <Skeleton className='h-6 w-64' />
            <div className='flex items-center gap-3'>
              <Skeleton className='h-6 w-12 rounded-sm' />
              <Skeleton className='h-4 w-32' />
            </div>
          </div>

          <div className='flex flex-row items-center gap-1 font-semibold mt-4'>
            <Skeleton className='h-6 w-12' />
            <Skeleton className='h-6 w-20 ml-2' />
          </div>
        </div>
      </CardContent>

      <CardFooter className='items-end justify-end gap-2'>
        <Skeleton className='h-8 w-22 rounded-md' />
        <Skeleton className='h-8 w-22 rounded-md' />
      </CardFooter>
    </Card>
  );
};

export default SkeletonCard;
