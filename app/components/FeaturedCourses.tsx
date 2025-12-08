import CourseCard from './CourseCard';
import { getFeaturedCourses } from '@/lib/actions/course';

const FeaturedCourses = async () => {
  const courses = await getFeaturedCourses();

  return (
    <section className='my-10'>
      <div className='container'>
        <h2 className='text-2xl md:text-3xl font-bold mb-6 dark:text-white'>
          Featured Courses
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {courses.map((course) => (
            <CourseCard key={course.title} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
