import { getMyCart } from '@/lib/actions/cart';
import CourseCard from '../shared/CourseCard';
import { getFeaturedCourses } from '@/lib/actions/course';
import { getUserById } from '@/lib/actions/user';

const FeaturedCourses = async () => {
  const courses = await getFeaturedCourses();
  const cart = await getMyCart();
  const user = await getUserById();

  return (
    <section className='section-spacing'>
      <div className='container'>
        <h2 className='text-2xl md:text-3xl font-bold mb-6 dark:text-white'>
          Featured Courses
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
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
