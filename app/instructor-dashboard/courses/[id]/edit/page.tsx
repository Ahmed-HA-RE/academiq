import CreateUpdateCourseForm from '@/app/components/instructor/courses/CreateUpdateCourseForm';
import { getCourseById } from '@/lib/actions/course/getCourses';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Course',
  description: 'Edit your course details and sections.',
};

const EditCoursePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const course = await getCourseById(id);

  if (!course) redirect('/instructor-dashboard/courses');

  return (
    <div className='col-span-4'>
      <CreateUpdateCourseForm type='edit' course={course} />
    </div>
  );
};

export default EditCoursePage;
