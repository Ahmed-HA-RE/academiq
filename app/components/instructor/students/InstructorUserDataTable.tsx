import { getEnrolledStudentsForInstructor } from '@/lib/actions/instructor/analytics';
import InstructorUsersDataTableDetails from './InstructorUserDataTableDetails';
import { loadSearchParams } from '@/lib/searchParams';
import { SearchParams } from 'nuqs/server';

const InstructorUserDataTable = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { q } = await loadSearchParams(searchParams);

  const { students: enrolledStudents, totalPages } =
    await getEnrolledStudentsForInstructor({
      limit: 5,
      q,
    });

  return (
    <InstructorUsersDataTableDetails
      enrolledStudents={enrolledStudents}
      totalPages={totalPages}
    />
  );
};

export default InstructorUserDataTable;
