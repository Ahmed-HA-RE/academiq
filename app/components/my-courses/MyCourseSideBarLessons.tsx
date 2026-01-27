'use client';
import { Lesson } from '@/types';
import { cn } from '@/lib/utils';
import { CircleCheckBig, CirclePlayIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MyCourseSideBarLessons = ({
  lesson,
  sectionId,
  slug,
  lessonsProgress,
}: {
  slug: string;
  sectionId: string;
  lesson: Omit<Lesson, 'muxData'>;
  lessonsProgress: {
    id: string;
    lessonId: string;
    updatedAt: Date;
    userId: string;
    completed: boolean;
  }[];
}) => {
  const pathname = usePathname();
  const isActive = pathname.includes(lesson.id);

  const isCompleted =
    lessonsProgress.find((progress) => progress.lessonId === lesson.id)
      ?.completed || false;

  return (
    <Link
      href={`/my-courses/${slug}/${sectionId}/${lesson.id}`}
      key={lesson.id}
      className={cn(
        'flex items-center gap-8 hover:bg-gray-200 hover:dark:bg-muted px-3 py-2 transition',
        isActive && 'bg-gray-200 dark:bg-muted',
        isCompleted
          ? 'border-l-2 border-emerald-600 dark:border-emerald-500'
          : isActive &&
              !isCompleted &&
              'border-l-2 border-gray-300 dark:border-gray-400',
      )}
    >
      <div className={cn('flex items-center gap-4')}>
        {isCompleted ? (
          <CircleCheckBig className='size-4 text-emerald-600 dark:text-emerald-500' />
        ) : (
          <CirclePlayIcon className='size-4' />
        )}
        <span
          className={cn('text-sm', isCompleted && 'line-through opacity-60')}
        >
          {lesson.title}
        </span>
      </div>
    </Link>
  );
};

export default MyCourseSideBarLessons;
