'use client';
import { Progress } from '../ui/progress';
import { usePathname } from 'next/navigation';

const CourseProgression = () => {
  const pathname = usePathname();

  return (
    <div className='flex flex-col gap-2 items-start'>
      <Progress value={10} max={100} className='w-full mt-4 [&>*]:bg-sky-500' />
      {pathname === '/my-courses' && <p>10% Completed</p>}
    </div>
  );
};

export default CourseProgression;
