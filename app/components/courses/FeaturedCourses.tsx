import { getMyCart } from '@/lib/actions/cart';
import CourseCard from '../shared/CourseCard';
import { getFeaturedCourses } from '@/lib/actions/course';
import { getCurrentLoggedUser } from '@/lib/actions/user';

const FeaturedCourses = async () => {
  const [courses, cart, user] = await Promise.all([
    getFeaturedCourses(),
    getMyCart(),
    getCurrentLoggedUser(),
  ]);

  return (
    <section className='section-spacing'>
      <div className='container'>
        <h2 className='text-2xl md:text-3xl font-bold mb-6 dark:text-white'>
          Featured Courses
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {courses.map((course) => (
            <CourseCard
              key={course.title}
              course={course}
              cart={cart}
              user={user}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
