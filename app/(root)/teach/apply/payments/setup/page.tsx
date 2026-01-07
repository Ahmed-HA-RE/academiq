import SetUpStripeConnectCard from '@/app/components/instructor/SetUpStripeConnectCard';
import ApplicationStepper from '@/app/components/teach/ApplicationStepper';
import { getStripeAccountByApplication } from '@/lib/actions/instructor';
import { APP_NAME } from '@/lib/constants';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Set Up Payment',
  description: `Set up your payment details to start receiving payouts as an instructor on ${APP_NAME}.`,
};

const SetupPayment = async () => {
  const account = await getStripeAccountByApplication();

  if (!account) redirect('/teach/apply');

  if (account && account.charges_enabled && account.payouts_enabled)
    redirect('/application/status');

  return (
    <div className='min-h-screen bg-gradient-to-b from-background to-muted/20'>
      <div className='container'>
        {/* Stepper Section */}
        <div className='mb-8 md:mb-12'>
          <ApplicationStepper currentStep={2} />
        </div>

        {/* Main Content Card */}
        <div className='mx-auto max-w-3xl'>
          <div className='rounded-2xl bg-card shadow-lg border p-6 md:p-8 lg:p-12'>
            <SetUpStripeConnectCard account={account} />
          </div>
        </div>

        {/* Optional: Add progress indicator */}
        <div className='mt-8 text-center'>
          <p className='text-muted-foreground text-sm'>
            Almost there! Complete your payment setup to finish your instructor
            application
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetupPayment;
