import AdminCourseDataTable from '@/app/components/admin/courses/AdminCoursesDataTable';
import { Metadata } from 'next';
import { SearchParams } from 'nuqs/server';

export const metadata: Metadata = {
  title: 'Instructors Courses',
  description:
    'Manage and view all courses created by instructors on the platform.',
};

const InstructorsCoursesPage = ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  return <AdminCourseDataTable searchParams={searchParams} />;
};

export default InstructorsCoursesPage;
