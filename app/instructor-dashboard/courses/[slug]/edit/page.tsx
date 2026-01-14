import CreateUpdateCourseForm from '@/app/components/instructor/courses/CreateUpdateCourseForm';
import { getCourseBySlug } from '@/lib/actions/course';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Course',
  description: 'Edit your course details and sections.',
};

const EditCoursePage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const course = await getCourseBySlug(slug);

  if (!course) redirect('/instructor-dashboard/courses');

  if (!course) redirect('/instructor-dashboard/courses');
  return (
    <div className='col-span-4'>
      <CreateUpdateCourseForm type='edit' course={course} />
    </div>
  );
};

export default EditCoursePage;
