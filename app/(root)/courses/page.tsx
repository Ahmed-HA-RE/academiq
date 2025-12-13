import CategoriesFilter from '@/app/components/courses/CategoriesFilter';
import CoursesPagination from '@/app/components/courses/CoursesPagination';
import { getMyCart } from '@/lib/actions/cart';
import { getAllCourses } from '@/lib/actions/course';
import { loadSearchParams } from '@/lib/searchParams';
import type { SearchParams } from 'nuqs/server';

const CoursesPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { q, rating, price, difficulty, sortBy, page } =
    await loadSearchParams(searchParams);

  const { courses, totalPages } = await getAllCourses({
    q,
    rating,
    price,
    difficulty,
    sortBy,
    page,
  });
  const cart = await getMyCart();

  return (
    <section>
      <div className='container space-y-8'>
        <div className='space-y-4'>
          <h1 className='text-3xl font-bold'>Courses</h1>
        </div>
        <CategoriesFilter courses={courses} cart={cart} />
        {totalPages && totalPages > 1 && (
          <CoursesPagination totalPages={totalPages} />
        )}
      </div>
    </section>
  );
};

export default CoursesPage;
