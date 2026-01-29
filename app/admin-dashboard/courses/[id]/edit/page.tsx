import CreateUpdateCourseForm from '@/app/components/instructor/courses/CreateUpdateCourseForm';
import { getCourseById } from '@/lib/actions/course/getCourses';
import { getCurrentLoggedUser } from '@/lib/actions/getUser';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Course',
  description: 'Edit course details as an admin',
};

const EditCourseAsAdmin = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const [course, user] = await Promise.all([
    getCourseById(id),
    getCurrentLoggedUser(),
  ]);

  if (!course) redirect('/admin-dashboard/courses');

  return (
    <div className='col-span-4'>
      <CreateUpdateCourseForm type='edit' course={course} user={user} />
    </div>
  );
};

export default EditCourseAsAdmin;
