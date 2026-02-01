import EditInstructorForm from '@/app/components/admin/Instructor/EditInstructorForm';
import { getUserProviderId } from '@/lib/actions/auth';
import { getInstructorByIdAsAdmin } from '@/lib/actions/instructor/getInstructor';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Instructor',
  description: 'Edit instructor details in the admin dashboard',
};

const EditInstructorPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const [instructor, providerId] = await Promise.all([
    getInstructorByIdAsAdmin(id),
    getUserProviderId(),
  ]);

  return (
    <div className='col-span-4 space-y-14'>
      <div className='space-y-2'>
        <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>
          Edit {instructor.user.name}
        </h1>
        <p className='text-muted-foreground text-sm md:text-base'>
          Manage instructor profile and account settings
        </p>
      </div>

      <div className='flex flex-col lg:flex-row gap-6 lg:gap-12'>
        {/* Left side */}
        <div className='md:w-80 lg:w-80 space-y-3'>
          <h3 className='text-xl md:text-2xl font-semibold'>
            Instructor Details
          </h3>
          <p className='text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl w-full'>
            Update and manage the instructor&apos;s profile, including personal
            information, expertise, contact details, and account status.
          </p>
        </div>
        {/* Right side */}
        <div className='flex-1'>
          <EditInstructorForm
            instructor={instructor}
            providerId={providerId}
            type='admin'
          />
        </div>
      </div>
    </div>
  );
};

export default EditInstructorPage;
