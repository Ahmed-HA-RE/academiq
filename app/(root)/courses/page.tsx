import CategoriesFilter from '@/app/components/courses/CategoriesFilter';
import CoursesPagination from '@/app/components/courses/CoursesPagination';
import { getMyCart } from '@/lib/actions/cart';
import { getAllCourses } from '@/lib/actions/course';
import { loadSearchParams } from '@/lib/searchParams';
import type { SearchParams } from 'nuqs/server';
import { Metadata } from 'next';

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}): Promise<Metadata> => {
  const filters = Object.values(await searchParams);

  if (filters.length > 0) {
    return {
      title: `Courses: ${filters.join(', ')}`,
      description:
        'Browse our wide range of online courses and find the perfect match for your learning goals. Filter by rating, price, difficulty, or search to discover courses that fit your needs.',
    };
  } else {
    return {
      title: 'Courses',
      description:
        'Browse our wide range of online courses and find the perfect match for your learning goals. Filter by rating, price, difficulty, or search to discover courses that fit your needs.',
    };
  }
};

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
