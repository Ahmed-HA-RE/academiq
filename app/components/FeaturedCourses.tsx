import { sampleData } from '@/sampleData';
import CourseCard from './CourseCard';

const FeaturedCourses = () => {
  return (
    <section className='py-10'>
      <h2 className='text-2xl md:text-3xl font-bold mb-6 dark:text-white'>
        Featured Courses
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {sampleData.slice(0, 3).map((course) => (
          <CourseCard key={course.title} course={course} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedCourses;
