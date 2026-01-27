'use client';
import { UserProgress } from '@/types';
import { Progress } from '../ui/progress';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const CourseUserProgress = ({
  userProgress,
}: {
  userProgress: UserProgress | undefined;
}) => {
  const pathname = usePathname();

  return (
    <div className=' w-full flex flex-col items-start gap-1.5'>
      <Progress
        value={Number(userProgress?.progress)}
        max={100}
        variant={Number(userProgress?.progress) > 0 ? 'success' : 'default'}
      />
      {pathname.startsWith('/my-courses') && (
        <p
          className={cn(
            'text-sm font-medium',
            Number(userProgress?.progress) > 0
              ? 'text-emerald-700 dark:text-emerald-600'
              : 'text-black/90 dark:text-white/90',
          )}
        >
          {Number(userProgress?.progress) === 0
            ? `0%`
            : `${userProgress?.progress}%`}{' '}
          Completed
        </p>
      )}
    </div>
  );
};

export default CourseUserProgress;
