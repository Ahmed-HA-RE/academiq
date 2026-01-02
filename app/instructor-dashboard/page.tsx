import { Metadata } from 'next';
import StatisticsCard from '../components/instructor/StatisticsCard';

export const metadata: Metadata = {
  title: 'Overview',
  description:
    'View your courses, track student progress, monitor revenue, and manage your teaching analytics all in one place.',
};

const InstructorHomePage = async () => {
  return <StatisticsCard />;
};

export default InstructorHomePage;
