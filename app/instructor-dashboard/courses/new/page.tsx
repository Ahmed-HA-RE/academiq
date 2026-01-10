import CreateUpdateCourseForm from '@/app/components/shared/CreateUpdateCourseForm';
import { getCurrentLoggedInInstructor } from '@/lib/actions/instructor';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New Course',
  description: 'Create a new course to share your knowledge with students.',
};

const CreateCoursePage = async () => {
  const instructor = await getCurrentLoggedInInstructor();

  return (
    <div className='col-span-4'>
      <CreateUpdateCourseForm type='create' instructor={instructor} />
    </div>
  );
};

export default CreateCoursePage;
