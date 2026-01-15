'use client';

import { Cart, CourseCardType, User } from '@/types';
import { useTransition } from 'react';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { addToCart, removeFromCart } from '@/lib/actions/cart';
import { toast } from 'sonner';
import { usePathname, useRouter } from 'next/navigation';
import { SERVER_URL } from '@/lib/constants';
import Link from 'next/link';

const EnrollCourseBtn = ({
  course,
  cart,
  user,
}: {
  course: CourseCardType;
  cart: Cart | undefined;
  user: User | undefined;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const callbackUrl = `${SERVER_URL}${pathname}`;

  const isCourseInCart =
    cart && cart.cartItems.find((item) => item.courseId === course.id);

  const isUserEnrolled = user && user.courses?.some((c) => c.id === course.id);

  const isCourseOwnedToInstructor =
    user && user.role === 'instructor' && course.instructor?.userId === user.id;

  const handleAddToCart = async () => {
    if (!user) {
      router.push(`/login?callbackUrl=${callbackUrl}`);
    } else
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
      className='min-w-24 cursor-pointer'
      size={'sm'}
      variant={'default'}
      onClick={() => {
        router.push(`/my-courses/${course.slug}`);
      }}
    >
      View Course
    </Button>
  ) : isCourseOwnedToInstructor ? (
    <Button
      className='min-w-24 cursor-pointer bg-amber-500 text-white hover:bg-amber-500/80'
      size={'sm'}
      variant={'default'}
      asChild
    >
      <Link href={`/instructor-dashboard/courses/${course.slug}/edit`}>
        Edit Course
      </Link>
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
