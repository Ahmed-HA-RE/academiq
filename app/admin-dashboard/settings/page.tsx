import { getCurrentLoggedUser, getUserById } from '@/lib/actions/user';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import EditUserForm from '@/app/components/admin/Users/EditUserForm';

export const metadata: Metadata = {
  title: 'Account Settings',
  description: 'Manage your personal information and account preferences.',
};

const SettingsPage = async () => {
  const user = await getCurrentLoggedUser();

  if (!user) redirect('/admin-dashboard/users');

  return (
    <div className='col-span-4 space-y-8'>
      <h1 className='text-2xl md:text-3xl lg:text-3xl font-medium'>
        Account Settings
      </h1>
      <EditUserForm user={user} />
    </div>
  );
};

export default SettingsPage;
