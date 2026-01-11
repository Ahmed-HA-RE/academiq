import { getAllInstructorCourses } from '@/lib/actions/course';
import CoursesDataTableDetails from './CoursesDataTableDetails';

const CoursesDataTable = async () => {
  const { courses } = await getAllInstructorCourses();

  return <CoursesDataTableDetails courses={courses} />;
};

export default CoursesDataTable;
