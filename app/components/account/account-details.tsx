import { User } from '@/types';
import AccountDetailsForm from './account-details-form';
import { getUserProviderId } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';

const AccountDetails = async ({ user }: { user: User }) => {
  const providerId = await getUserProviderId();

  if (!providerId) {
    return redirect('/login');
  }

  return (
    <>
      <div className='grid grid-cols-1 gap-8'>
        <div className='flex flex-col lg:flex-row items-start gap-5'>
          {/* User Profile Form */}
          <div className='space-y-3 flex-1/3'>
            <h3 className='text-xl font-semibold'>
              Account & Billing Information
            </h3>
            <p className='text-muted-foreground text-sm lg:max-w-md'>
              Update your personal details, including your name, email address,
              profile picture, and billing information.
            </p>
          </div>
          <AccountDetailsForm user={user} providerId={providerId} />
        </div>

        {/* User Password Management Form */}
      </div>
    </>
  );
};

export default AccountDetails;
