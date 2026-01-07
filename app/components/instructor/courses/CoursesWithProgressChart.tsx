import { getCoursesWithProgressByInstructor } from '@/lib/actions/instructor/analytics';
import CoursesWithProgressChartDetails from './CoursesWithProgressChartDetails';

const CoursesWithProgressChart = async () => {
  const results = await getCoursesWithProgressByInstructor();

  return <CoursesWithProgressChartDetails results={results} />;
};

export default CoursesWithProgressChart;
