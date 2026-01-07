import InstructorUserDataTable from '@/app/components/instructor/students/InstructorUserDataTable';
import { Metadata } from 'next';
import { SearchParams } from 'nuqs/server';

export const metadata: Metadata = {
  title: 'Students',
  description:
    'Manage and view the students that are enrolled in your courses.',
};

const InstructorStudentsPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  return <InstructorUserDataTable searchParams={searchParams} />;
};

export default InstructorStudentsPage;
