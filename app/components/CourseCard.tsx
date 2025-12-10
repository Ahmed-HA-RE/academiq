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
import { addToCart, removeFromCart } from '@/lib/actions/cart';
import { useState } from 'react';
import { toast } from 'sonner';
import { Spinner } from './ui/spinner';
import { useTransition } from 'react';
import { CartItems } from '@/types';

type CourseCardProps = {
  course: Course;
  cartItems: CartItems[];
};

const CourseCard = ({ course, cartItems }: CourseCardProps) => {
  const [isPending, startTransition] = useTransition();

  const isCourseInCart = cartItems.find((item) => item.courseId === course.id);

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addToCart({
        courseId: course.id,
        image: course.image,
        name: course.title,
        price: course.salePrice ? course.salePrice : course.price,
      });

      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeFromCart(course.id);
      toast.success(res.message);
    });
  };

  return (
    <MotionPreset
      component='div'
      fade
      slide={{ direction: 'down', offset: 50 }}
      blur
      transition={{ duration: 0.5 }}
      delay={0.4}
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
                loading='eager'
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
          {isCourseInCart ? (
            <Button
              onClick={handleRemoveFromCart}
              className='cursor-pointer w-24 bg-destructive text-white hover:bg-destructive/70'
              size={'sm'}
              variant={'default'}
              disabled={isPending}
            >
              {isPending ? <Spinner className='size-6' /> : 'Remove'}
            </Button>
          ) : (
            <Button
              onClick={handleAddToCart}
              className='cursor-pointer min-w-24'
              size={'sm'}
              variant={'outline'}
              disabled={isPending}
            >
              {isPending ? <Spinner className='size-6' /> : 'Enroll Now'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </MotionPreset>
  );
};

export default CourseCard;
