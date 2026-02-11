'use client';

import { BadgeCheckIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Course, User } from '@/types';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Suspense } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import CourseCardBtn from './CourseCardBtn';

type CourseCardProps = {
  course: Course;
  user: User | undefined;
  subscription?: {
    referenceId: string;
    plan: string;
    stripeSubscriptionId?: string;
  } | null;
};

const CourseCard = ({ course, user, subscription }: CourseCardProps) => {
  const isEnrolled =
    (subscription && subscription.plan === 'active') ||
    user?.courses?.find((c) => c.id === course.id);

  return (
    <Card className='hover:shadow-lg transition-shadow duration-300 ease-in-out pt-0 pb-4 overflow-hidden gap-2'>
      <CardHeader className='p-0 relative'>
        <Link href={`/course/${course.id}`}>
          <Image
            src={course.image}
            alt={course.title}
            sizes='100vw'
            width={0}
            height={0}
            className='object-cover object-center w-full h-54 rounded-t-md hover:scale-105 transition-transform duration-300 ease-in-out'
          />
          <Badge className='absolute top-4 left-3 rounded-sm bg-emerald-500 text-white  dark:bg-emerald-500'>
            {course.difficulty}
          </Badge>
        </Link>
      </CardHeader>
      <CardContent className='px-4'>
        <div className='flex flex-col gap-4'>
          {/* Course title */}
          <Link href={`/course/${course.id}`}>
            <h3 className='text-lg hover:text-blue-500 hover:dark:text-blue-400 transition duration-300'>
              {course.title}
            </h3>
          </Link>
          {/* Instructor info */}
          <div className='flex items-center gap-2'>
            <div className='relative w-fit'>
              <Avatar className='size-8 rounded-full'>
                <Suspense
                  fallback={
                    <AvatarFallback>
                      {course.instructor.user.name.charAt(0)}
                    </AvatarFallback>
                  }
                >
                  <Image
                    src={course.instructor.user.image}
                    alt={course.instructor.user.name}
                    width={32}
                    height={32}
                    className='rounded-full object-cover'
                  />
                </Suspense>
              </Avatar>
              <span className='absolute -top-1.5 -right-1.5'>
                <BadgeCheckIcon className='text-background size-5 fill-sky-500' />
              </span>
            </div>
            <span className='text-sm'>by {course.instructor.user.name}</span>
          </div>
          {/* Description */}
          <span
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(course.shortDesc, {
                ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
              }),
            }}
            className='text-sm text-muted-foreground line-clamp-2'
          ></span>

          {!isEnrolled && (
            <div className='flex flex-row items-center gap-1 font-semibold'>
              <span className='dirham-symbol !text-lg'>&#xea;</span>
              <span className='text-xl'>{course.price}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className='grid grid-cols-2 gap-2 mt-2 px-3'>
        <Button
          asChild
          className='cursor-pointer text-sm'
          size={'default'}
          variant={'outline'}
        >
          <Link href={`/course/${course.id}`}>View Details</Link>
        </Button>
        <CourseCardBtn
          course={course}
          user={user}
          subscription={subscription}
        />
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
