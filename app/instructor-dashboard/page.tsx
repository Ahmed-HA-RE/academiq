import { Metadata } from 'next';
import StatisticsCard from '../components/instructor/StatisticsCard';
import TotalRevenueChart from '../components/instructor/TotalRevenueChart';
import PopularCoursesCard from '../components/instructor/PopularCoursesCard';

export const metadata: Metadata = {
  title: 'Overview',
  description:
    'View your courses, track student progress, monitor revenue, and manage your teaching analytics all in one place.',
};

const InstructorHomePage = async () => {
  return (
    <>
      <StatisticsCard />
      <TotalRevenueChart />
      <PopularCoursesCard />
    </>
  );
};

export default InstructorHomePage;
