import { getUserById } from '@/lib/actions/getUser';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import EditUserForm from '@/app/components/admin/Users/EditUserForm';
import { getUserProviderId } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Edit User',
  description: 'Edit user details in the admin dashboard',
};

const EditUserPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const [user, providerId] = await Promise.all([
    getUserById(id),
    getUserProviderId(),
  ]);

  if (!user) redirect('/admin-dashboard/users');

  return (
    <div className='col-span-4 space-y-8'>
      <h1 className='text-2xl md:text-3xl lg:text-3xl font-medium'>
        Edit {user.name}
      </h1>
      <EditUserForm user={user} providerId={providerId} />
    </div>
  );
};

export default EditUserPage;
