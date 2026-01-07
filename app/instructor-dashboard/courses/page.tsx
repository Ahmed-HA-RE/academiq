import CoursesDataTable from '@/app/components/instructor/courses/CoursesDataTable';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Instructor Courses',
  description:
    'Manage your courses, create new sections, and edit existing ones.',
};

const InstructorCoursesPage = () => {
  return <CoursesDataTable />;
};

export default InstructorCoursesPage;
