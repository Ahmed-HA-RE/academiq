'use client';

import { Cart, Course, User } from '@/types';
import { useTransition } from 'react';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { addToCart, removeFromCart } from '@/lib/actions/cart';
import { toast } from 'sonner';

const EnrollCourseBtn = ({
  course,
  cart,
  user,
}: {
  course: Course;
  cart: Cart | undefined;
  user: User | undefined;
}) => {
  const [isPending, startTransition] = useTransition();

  const isCourseInCart =
    cart && cart.cartItems.find((item) => item.courseId === course.id);

  const isUserEnrolled = user && user.courses.some((c) => c.id === course.id);
  console.log(isUserEnrolled);

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addToCart({
        courseId: course.id,
        image: course.image,
        name: course.title,
        price: course.price,
        slug: course.slug,
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
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
    });
  };

  return isCourseInCart ? (
    <Button
      onClick={handleRemoveFromCart}
      className='cursor-pointer w-24 bg-destructive text-white hover:bg-destructive/70'
      size={'sm'}
      variant={'default'}
      disabled={isPending}
    >
      {isPending ? <Spinner className='size-6' /> : 'Remove'}
    </Button>
  ) : isUserEnrolled ? (
    <Button
      disabled
      className='cursor-not-allowed min-w-24'
      size={'sm'}
      variant={'outline'}
    >
      Enrolled
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
  );
};

export default EnrollCourseBtn;
