'use client';
import { UserProgress } from '@/types';
import { Progress } from '../ui/progress';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const CourseProgression = ({
  userProgress,
}: {
  userProgress: UserProgress | undefined;
}) => {
  const pathname = usePathname();

  return (
    <div className='flex flex-col gap-4 items-start'>
      <Progress
        value={userProgress && Number(userProgress.progress)}
        max={100}
        className='w-full mt-4 [&>*]:bg-sky-500'
      />
      {pathname === '/my-courses' && (
        <p
          className={cn(
            Number(userProgress?.progress) === 0
              ? 'text-red-600 font-medium'
              : 'text-green-600 font-medium',
          )}
        >
          {Number(userProgress?.progress) === 0
            ? `0% Completed`
            : `${userProgress?.progress}% Completed`}
        </p>
      )}
    </div>
  );
};

export default CourseProgression;
