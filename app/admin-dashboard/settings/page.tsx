import { getCurrentLoggedUser } from '@/lib/actions/getUser';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import EditUserForm from '@/app/components/admin/Users/EditUserForm';
import { getUserProviderId } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Account Settings',
  description: 'Manage your personal information and account preferences.',
};

const SettingsPage = async () => {
  const [user, providerId] = await Promise.all([
    getCurrentLoggedUser(),
    getUserProviderId(),
  ]);

  if (!user) redirect('/admin-dashboard/users');

  return (
    <div className='col-span-4 space-y-8'>
      <h1 className='text-2xl md:text-3xl lg:text-3xl font-medium'>
        Account Settings
      </h1>
      <EditUserForm user={user} providerId={providerId} />
    </div>
  );
};

export default SettingsPage;
