'use client';

import { Course, User } from '@/types';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { toast } from 'react-hot-toast';
import { usePathname, useRouter } from 'next/navigation';
import { SERVER_URL } from '@/lib/constants';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { addCourseToLibrary } from '@/lib/actions/course/add-course-to-library';
import { createStripeCheckoutSession } from '@/lib/actions/stripe.action';

type CourseCardBtnProps = {
  course: Course;
  user: User | undefined;
  subscription?: {
    referenceId: string;
    plan: string;
    stripeSubscriptionId?: string;
  } | null;
  isPending: boolean;
  setIsPending: React.Dispatch<React.SetStateAction<boolean>>;
};

const CourseCardBtn = ({
  course,
  user,
  subscription,
  isPending,
  setIsPending,
}: CourseCardBtnProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const callbackUrl = `${SERVER_URL}${pathname}`;

  const isAdmin = user && user.role === 'admin';

  const isUserEnrolled = user && user.courses?.some((c) => c.id === course.id);

  const isCourseOwnedToInstructor =
    user && user.role === 'instructor' && course.instructor?.userId === user.id;

  const isCourseDetailsPage = pathname.includes(`/course/${course.id}`);

  const handleAddToLibrary = async () => {
    if (!user) {
      router.push(`/login?callbackUrl=${callbackUrl}`);
    } else {
      setIsPending(true);
      const res = await addCourseToLibrary(course.id);

      if (!res.success) {
        toast.error(res.message);
        setIsPending(false);
        return;
      }
      toast.success(res.message);
      router.refresh();
    }
  };

  const createCheckoutSession = async () => {
    if (!user) {
      router.push(`/login?callbackUrl=${callbackUrl}`);
    } else {
      setIsPending(true);
      const res = await createStripeCheckoutSession({
        courseId: course.id,
        pathname,
      });

      if (!res.success || !res.redirect) {
        setIsPending(false);
        toast.error('Failed to create checkout session. Please try again.');
        return;
      }

      router.push(res.redirect);
    }
  };

  return isAdmin ? (
    <Button
      className={`cursor-pointer w-full ${!isCourseDetailsPage ? 'text-sm' : 'text-xs'}`}
      size={!isCourseDetailsPage ? 'default' : 'lg'}
      variant={'default'}
      asChild
    >
      <Link href={`/admin-dashboard/courses/${course.id}/edit`}>
        Edit Course
      </Link>
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
  ) : subscription ? (
    <Button
      className={`w-full cursor-pointer ${!isCourseDetailsPage ? 'text-sm' : 'text-xs'}`}
      size={!isCourseDetailsPage ? 'default' : 'lg'}
      variant={'default'}
      onClick={handleAddToLibrary}
      disabled={isPending}
    >
      {isPending ? <Spinner className='size-6' /> : 'Add to Library'}
    </Button>
  ) : (
    <Button
      className={`w-full cursor-pointer ${!isCourseDetailsPage ? 'text-sm' : 'text-xs'} bg-lime-500 hover:bg-lime-600 text-white ${
        !isCourseDetailsPage && 'text-sm'
      }`}
      size={!isCourseDetailsPage ? 'default' : 'lg'}
      variant={'default'}
      onClick={createCheckoutSession}
      disabled={isPending}
    >
      Enroll Now
    </Button>
  );
};

export default CourseCardBtn;
