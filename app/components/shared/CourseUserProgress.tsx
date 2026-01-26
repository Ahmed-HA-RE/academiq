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
    <div className=' w-full flex flex-row items-center gap-4'>
      <Progress
        value={Number(userProgress?.progress)}
        max={100}
        className={cn(
          Number(userProgress?.progress) === 100
            ? '[&>*]:bg-green-700'
            : Number(userProgress?.progress) > 0
              ? '[&>*]:bg-sky-500'
              : '[&>*]:bg-muted-foreground/20',
        )}
      />
      {pathname.startsWith('/my-courses') && (
        <p
          className={cn(
            Number(userProgress?.progress) === 100
              ? 'text-green-700'
              : Number(userProgress?.progress) > 0
                ? 'text-sky-500'
                : 'text-muted-foreground',
            'text-sm font-medium',
          )}
        >
          {Number(userProgress?.progress) === 0
            ? `0%`
            : `${userProgress?.progress}%`}
        </p>
      )}
    </div>
  );
};

export default CourseUserProgress;
