import CategoriesFilter from '@/app/components/courses/CategoriesFilter';
import { getMyCart } from '@/lib/actions/cart';
import { getAllCourses } from '@/lib/actions/course';
const CoursesPage = async () => {
  const courses = await getAllCourses();
  const cart = await getMyCart();

  return (
    <section>
      <div className='container'>
        <h1 className='text-3xl font-bold mb-8'>Courses</h1>
        <CategoriesFilter courses={courses} cart={cart} />
      </div>
    </section>
  );
};

export default CoursesPage;
