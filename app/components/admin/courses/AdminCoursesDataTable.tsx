import { getAllCourses } from '@/lib/actions/course/getCourses';
import AdminCoursesDataTableDetails from './AdminCoursesDataTableDetails';
import { SearchParams } from 'nuqs/server';
import { loadSearchParams } from '@/lib/searchParams';

const AdminCourseDataTable = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { status, q, page } = await loadSearchParams(searchParams);

  const { courses, totalPages } = await getAllCourses({
    status,
    q,
    page,
  });

  return (
    <AdminCoursesDataTableDetails courses={courses} totalPages={totalPages} />
  );
};

export default AdminCourseDataTable;
