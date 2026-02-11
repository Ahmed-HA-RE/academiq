import { SearchParams } from 'nuqs/server';
import CourseCard from '../shared/CourseCard';
import { loadSearchParams } from '@/lib/searchParams';
import { getCurrentLoggedUser } from '@/lib/actions/getUser';
import { listUserSubscription } from '@/lib/actions/subscription/list-user-subscription';
import { getAllCourses } from '@/lib/actions/course/getCourses';
import DataPagination from '../shared/Pagination';

const CoursesList = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { q, category, page } = await loadSearchParams(searchParams);
  const [{ courses, totalPages }, user, subscription] = await Promise.all([
    getAllCourses({
      q,
      category,
      page,
    }),
    getCurrentLoggedUser(),
    listUserSubscription(),
  ]);

  return courses.length === 0 ? (
    <p>No courses found.</p>
  ) : (
    <div className='space-y-14'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {courses.map(
          (course) =>
            course.published && (
              <CourseCard
                key={course.id}
                course={course}
                user={user}
                subscription={subscription}
              />
            ),
        )}
      </div>
      {totalPages > 1 && <DataPagination totalPages={totalPages} />}
    </div>
  );
};

export default CoursesList;
