'use client';
import { Progress } from '../ui/progress';

const CourseProgression = () => {
  return (
    <Progress value={10} max={100} className='w-full mt-4 [&>*]:bg-sky-500' />
  );
};

export default CourseProgression;
