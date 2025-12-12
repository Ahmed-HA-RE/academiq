import CategoriesFilter from '@/app/components/courses/CategoriesFilter';
import { getMyCart } from '@/lib/actions/cart';
import { getAllCourses } from '@/lib/actions/course';
import { loadSearchParams } from '@/lib/searchParams';
import type { SearchParams } from 'nuqs/server';

const CoursesPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { q, rating, priceMin, priceMax, difficulty } =
    await loadSearchParams(searchParams);

  const courses = await getAllCourses({
    q,
    rating,
    priceMin,
    priceMax,
    difficulty,
  });
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
