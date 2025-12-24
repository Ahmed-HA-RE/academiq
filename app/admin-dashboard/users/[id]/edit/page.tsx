import EditUserForm from '@/app/components/admin/EditUserForm';
import { getUserById } from '@/lib/actions/user';
import { redirect } from 'next/navigation';

const EditUserPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) redirect('/admin-dashboard/users');

  return (
    <div className='col-span-4 space-y-8'>
      <h1 className='text-2xl md:text-3xl lg:text-3xl font-medium'>
        Edit {user.name}
      </h1>
      <EditUserForm user={user} />
    </div>
  );
};

export default EditUserPage;
