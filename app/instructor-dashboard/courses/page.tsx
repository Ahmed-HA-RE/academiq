import CoursesDataTable from '@/app/components/instructor/courses/CoursesDataTable';
import { Metadata } from 'next';
import { SearchParams } from 'nuqs/server';

export const metadata: Metadata = {
  title: 'Instructor Courses',
  description:
    'Manage your courses, create new sections, and edit existing ones.',
};

const InstructorCoursesPage = ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  return <CoursesDataTable searchParams={searchParams} />;
};

export default InstructorCoursesPage;
