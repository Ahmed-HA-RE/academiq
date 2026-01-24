import CategoriesFilter from '@/app/components/courses/CategoriesFilter';
import CoursesPagination from '@/app/components/shared/Pagination';
import { getMyCart } from '@/lib/actions/cart';
import { getAllCourses } from '@/lib/actions/course/getCourses';
import { loadSearchParams } from '@/lib/searchParams';
import type { SearchParams } from 'nuqs/server';
import { Metadata } from 'next';
import { getCurrentLoggedUser } from '@/lib/actions/getUser';
import { Alert, AlertTitle } from '@/app/components/ui/alert';
import { TriangleAlertIcon } from 'lucide-react';
import CourseCard from '@/app/components/shared/CourseCard';

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}): Promise<Metadata> => {
  const { q, rating, price, difficulty } = await searchParams;

  const filters: string[] = [];

  if (q) filters.push(`Search: ${q}`);
  if (rating) filters.push(`Rating: ${rating}+`);
  if (price) filters.push(`Price: ${price}`);
  if (difficulty) filters.push(`Difficulty: ${difficulty}`);

  if (filters.length > 0) {
    return {
      title: `${filters.join(' | ')}`,
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
  const { q, price, difficulty, category, sortBy, page } =
    await loadSearchParams(searchParams);

  const [{ courses, totalPages }, cart, user] = await Promise.all([
    getAllCourses({
      q,
      price,
      difficulty,
      category,
      sortBy,
      page,
    }),
    getMyCart(),
    getCurrentLoggedUser(),
  ]);

  return (
    <section className='my-10'>
      <div className='container space-y-8'>
        <div className='space-y-4'>
          <h1 className='text-3xl font-bold'>Courses</h1>
        </div>
        <div className='grid grid-cols-7 items-start gap-2.5'>
          <CategoriesFilter />
          {courses.length === 0 ? (
            <Alert
              variant='destructive'
              className='border-destructive col-span-7 md:col-span-4 lg:col-span-5 mx-auto md:max-w-sm my-10 md:my-0 '
            >
              <TriangleAlertIcon />
              <AlertTitle>No courses found.</AlertTitle>
            </Alert>
          ) : (
            <div className='col-span-7 md:col-span-4 lg:col-span-5 grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-3xl '>
              {courses.map(
                (course) =>
                  course.published && (
                    <CourseCard
                      key={course.id}
                      course={course}
                      cart={cart}
                      user={user}
                    />
                  ),
              )}
            </div>
          )}
        </div>
        {totalPages && totalPages > 1 ? (
          <CoursesPagination totalPages={totalPages} />
        ) : null}
      </div>
    </section>
  );
};

export default CoursesPage;
