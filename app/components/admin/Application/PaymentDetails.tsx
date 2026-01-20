'use client';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { notifyApplicant } from '@/lib/actions/stripe.action';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Stripe from 'stripe';
import { InstructorApplication } from '@/types';

type PaymentDetailsProps = {
  account: Stripe.Account;
  application: InstructorApplication;
  isPaymentEligible: boolean;
};

const PaymentDetails = ({
  account,
  application,
  isPaymentEligible,
}: PaymentDetailsProps) => {
  const isErrors =
    account.requirements?.errors && account.requirements.errors.length > 0;

  return (
    <Card className='gap-4'>
      <CardHeader className='gap-0 border-b [.border-b]:pb-4'>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4 px-6'>
        <div className='space-y-2'>
          <div className='flex flex-row gap-x-4 gap-y-2 items-center'>
            <h3>Payout Eligibility:</h3>
            <span
              className={cn(
                isPaymentEligible ? 'text-green-600' : 'text-red-500',
              )}
            >
              {isPaymentEligible ? 'Eligible' : 'Not Eligible'}
            </span>
          </div>
          {!isPaymentEligible && (
            <p className='text-sm text-muted-foreground'>
              The connected Stripe account is not eligible for payouts.{' '}
              {account.requirements?.currently_due?.length} documents is still
              required to enable payouts.
            </p>
          )}
        </div>
        {!isPaymentEligible && (
          <div className='space-y-8'>
            <div className='space-y-2'>
              <h2>Missing Documents:</h2>
              <ul className='space-y-2 min-w-0 pl-6'>
                {account.requirements?.currently_due?.map((requirement) => (
                  <li
                    key={requirement}
                    className='text-sm text-muted-foreground break-words whitespace-normal list-decimal'
                  >
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>
            {isErrors && (
              <div className='space-y-2'>
                <h2>Invalid Documents:</h2>
                <ul className='space-y-2 min-w-0 pl-6'>
                  {account.requirements?.errors?.map((error, index) => (
                    <li
                      key={index + 1}
                      className='text-sm text-muted-foreground break-words whitespace-normal list-decimal'
                    >
                      {error.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Button
              size={'sm'}
              className='rounded-full cursor-pointer text-xs'
              disabled={isPaymentEligible}
              onClick={async () => {
                await notifyApplicant({
                  userEmail: application.user.email,
                  userName: application.user.name,
                });
                toast.success('Notification sent to applicant successfully');
              }}
            >
              Notify Applicant
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentDetails;
