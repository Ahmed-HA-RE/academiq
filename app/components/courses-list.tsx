'use client';

import { Course, User } from '@/types';
import CourseCard from './shared/CourseCard';
import { useState } from 'react';

type CoursesListProps = {
  courses: Course[];
  user: User | undefined;
  subscription?: {
    referenceId: string;
    plan: string;
    stripeSubscriptionId?: string;
  } | null;
};

const CoursesList = ({ courses, user, subscription }: CoursesListProps) => {
  const [isPending, setIsPending] = useState(false);

  return (
    <div className='col-span-7 md:col-span-4 lg:col-span-5 grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-3xl '>
      {courses.map(
        (course) =>
          course.published && (
            <CourseCard
              key={course.id}
              course={course}
              user={user}
              subscription={subscription}
              isPending={isPending}
              setIsPending={setIsPending}
            />
          ),
      )}
    </div>
  );
};

export default CoursesList;
