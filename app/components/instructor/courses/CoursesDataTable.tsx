import { getAllInstructorCourses } from '@/lib/actions/course';
import CoursesDataTableDetails from './CoursesDataTableDetails';
import { SearchParams } from 'nuqs/server';
import { loadSearchParams } from '@/lib/searchParams';

const CoursesDataTable = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { status, q, page } = await loadSearchParams(searchParams);

  const { courses, totalPages } = await getAllInstructorCourses({
    status,
    q,
    page,
  });

  return <CoursesDataTableDetails courses={courses} totalPages={totalPages} />;
};

export default CoursesDataTable;
