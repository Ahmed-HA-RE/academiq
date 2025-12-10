'use client';
import { HeartIcon, StarIcon } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import Link from 'next/link';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Badge } from './ui/badge';
import { Course } from '@/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { MotionPreset } from './ui/motion-preset';
import { addToCart } from '@/lib/actions/cart';

const CourseCard = ({ course }: { course: Course }) => {
  const handleAddToCart = async () => {
    const res = await addToCart({
      courseId: course.id,
      image: course.image,
      name: course.title,
      price: course.salePrice ? course.salePrice : course.price,
    });
    console.log(res);
  };

  return (
    <MotionPreset
      component='div'
      fade
      slide={{ direction: 'down', offset: 50 }}
      blur
      transition={{ duration: 0.5 }}
      delay={0.4}
      className=''
    >
      <Card className='h-full shadow-none gap-4 py-0 pt-6 pb-4'>
        <CardContent className='flex flex-1 flex-col gap-6'>
          <div className='relative shrink-0 overflow-hidden rounded-md'>
            <Link href={`/course/${course.slug}`}>
              <Image
                src={course.image}
                alt={course.title}
                width={0}
                height={0}
                sizes='100vw'
                className='w-full max-h-[250px] object-cover'
              />
            </Link>
            <CheckboxPrimitive.Root
              data-slot='checkbox'
              className='group focus-visible:ring-ring/50 p-2 outline-none focus-visible:ring-3 absolute top-3 right-2.5 rounded-full border border-white/70 text-white cursor-pointer'
              aria-label='Heart icon'
            >
              <span className='group-data-[state=checked]:hidden'>
                <HeartIcon className='size-4' />
              </span>
              <span className='group-data-[state=unchecked]:hidden'>
                <HeartIcon className='fill-destructive stroke-destructive size-4' />
              </span>
            </CheckboxPrimitive.Root>
          </div>
          <div className='flex flex-1 flex-col gap-0'>
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
              <span className='dirham-symbol !text-xl '>&#xea;</span>
              <span
                className={cn(
                  'text-2xl',
                  course.salePrice && 'opacity-30 line-through'
                )}
              >
                {course.price}
              </span>
              {course.salePrice && (
                <span className='text-2xl'>/ {course.salePrice}</span>
              )}
            </div>
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
          <Button
            onClick={handleAddToCart}
            className='cursor-pointer'
            size={'sm'}
            variant={'outline'}
          >
            Enroll Now
          </Button>
        </CardFooter>
      </Card>
    </MotionPreset>
  );
};

export default CourseCard;
