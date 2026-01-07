import { getAllInstructorCourses } from '@/lib/actions/instructor/courses';
import CoursesDataTableDetails from './CoursesDataTableDetails';

const CoursesDataTable = async () => {
  const { courses } = await getAllInstructorCourses();

  return <CoursesDataTableDetails courses={courses} />;
};

export default CoursesDataTable;
