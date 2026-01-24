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
    <div className=' w-full flex flex-row items-center gap-4'>
      <Progress
        value={Number(userProgress?.progress)}
        max={100}
        className=' [&>*]:bg-sky-500'
      />
      {pathname === '/my-courses' && (
        <p
          className={cn(
            Number(userProgress?.progress) === 0
              ? 'text-red-600 font-medium'
              : Number(userProgress?.progress) < 50
                ? 'text-blue-600 font-medium'
                : 'text-green-600 font-medium',
            'text-sm',
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

export default CourseProgression;
