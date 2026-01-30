'use client';

import { Cart, Course, User } from '@/types';
import { useTransition } from 'react';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { addToCart, removeFromCart } from '@/lib/actions/cart';
import { toast } from 'react-hot-toast';
import { usePathname, useRouter } from 'next/navigation';
import { SERVER_URL } from '@/lib/constants';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const CourseCardBtn = ({
  course,
  cart,
  user,
}: {
  course: Course;
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

  const isCourseDetailsPage = pathname.includes(`/course/${course.id}`);

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
      className={`cursor-pointer bg-red-600 text-white hover:bg-red-700 w-full ${!isCourseDetailsPage ? 'text-sm' : 'text-xs'}`}
      size={!isCourseDetailsPage ? 'default' : 'lg'}
      variant={'default'}
      disabled={isPending}
    >
      {isPending ? <Spinner className='size-6' /> : 'Remove'}
    </Button>
  ) : isUserEnrolled ? (
    <Button
      className={`w-full cursor-pointer ${!isCourseDetailsPage ? 'text-sm' : 'text-xs'}`}
      size={!isCourseDetailsPage ? 'default' : 'lg'}
      variant={'default'}
      onClick={() => {
        router.push(`/my-courses`);
      }}
    >
      Go to Library
    </Button>
  ) : isCourseOwnedToInstructor ? (
    <Button
      className={cn(
        'cursor-pointer bg-blue-500 hover:bg-blue-600 dark:bg-amber-500 hover:dark:bg-amber-500/80  text-white w-full text-xs',
        !isCourseDetailsPage && 'text-sm bg-amber-500 hover:bg-amber-500/80',
      )}
      size={!isCourseDetailsPage ? 'default' : 'lg'}
      variant={'default'}
      asChild
    >
      <Link href={`/instructor-dashboard/courses/${course.id}/edit`}>
        Edit Course
      </Link>
    </Button>
  ) : (
    <Button
      onClick={handleAddToCart}
      className={`w-full cursor-pointer ${!isCourseDetailsPage ? 'text-sm' : 'text-xs'} bg-blue-500 hover:bg-blue-600 dark:bg-amber-500 hover:dark:bg-amber-500/80 text-white `}
      size={!isCourseDetailsPage ? 'default' : 'lg'}
      variant={'default'}
      disabled={isPending}
    >
      {isPending ? <Spinner className='size-6' /> : 'Enroll Now'}
    </Button>
  );
};

export default CourseCardBtn;
