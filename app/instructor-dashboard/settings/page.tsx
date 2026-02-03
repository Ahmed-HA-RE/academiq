import EditInstructorForm from '@/app/components/admin/Instructor/EditInstructorForm';
import { getCurrentLoggedInInstructor } from '@/lib/actions/instructor/getInstructor';
import { getUserProviderId } from '@/lib/actions/auth';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account settings',
};

const SettingsPage = async () => {
  const [instructor, providerId] = await Promise.all([
    getCurrentLoggedInInstructor(),
    getUserProviderId(),
  ]);

  return (
    <div className='col-span-4 space-y-8'>
      <div className='flex flex-row items-center justify-between'>
        <h1 className='text-3xl md:text-4xl font-bold tracking-tight text-center'>
          My Profile
        </h1>
        <Button variant='link' asChild>
          <Link href='/instructor-dashboard/settings/subscription'>
            View My Subscription
          </Link>
        </Button>
      </div>

      <EditInstructorForm
        instructor={instructor}
        type='instructor'
        providerId={providerId}
      />
    </div>
  );
};

export default SettingsPage;
