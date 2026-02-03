import AccountDetailsForm from './account-details-form';
import { getUserProviderId } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';
import { getCurrentLoggedUser } from '@/lib/actions/getUser';
import AccountPasswordForm from './account-password-form';
import { cn } from '@/lib/utils';

const AccountDetails = async () => {
  const [user, providerId] = await Promise.all([
    getCurrentLoggedUser(),
    getUserProviderId(),
  ]);

  if (!user || !providerId) {
    return redirect('/login');
  }

  return (
    <div
      className={cn('grid grid-cols-1', providerId === 'credential' && 'gap-8')}
    >
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
      {providerId === 'credential' && (
        <div className='flex flex-col lg:flex-row items-start gap-5'>
          {/* User Profile Form */}
          <div className='space-y-3 flex-1/3'>
            <h3 className='text-xl font-semibold'>Password</h3>
            <p className='text-muted-foreground text-sm lg:max-w-md'>
              Leave this blank to keep your current password.
            </p>
          </div>
          <AccountPasswordForm userEmail={user.email} />
        </div>
      )}
    </div>
  );
};

export default AccountDetails;
