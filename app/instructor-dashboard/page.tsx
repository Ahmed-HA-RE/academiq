import { Metadata } from 'next';
import StatisticsCard from '../components/instructor/StatisticsCard';
import PopularCoursesCard from '../components/instructor/courses/PopularCoursesCard';
import InstructorUserDataTable from '../components/instructor/students/InstructorUserDataTable';
import { SearchParams } from 'nuqs/server';
import CoursesWithProgressChart from '../components/instructor/courses/CoursesWithProgressChart';

export const metadata: Metadata = {
  title: 'Overview',
  description:
    'View your courses, track student progress, monitor revenue, and manage your teaching analytics all in one place.',
};

const InstructorHomePage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  return (
    <>
      <StatisticsCard />
      <PopularCoursesCard />
      <CoursesWithProgressChart />
      <InstructorUserDataTable searchParams={searchParams} />
    </>
  );
};

export default InstructorHomePage;
