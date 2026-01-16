import { createStripePayoutsLoginLink } from '@/lib/actions/stripe.action';
import { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { CreditCardIcon, ExternalLinkIcon, TrendingUpIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Instructor Payments',
  description: 'Manage your payment settings and view your earnings.',
};

const InstructorPaymentsPage = async () => {
  const loginLink = await createStripePayoutsLoginLink();

  return (
    <div className='space-y-6 col-span-4'>
      {/* Header */}
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Payments</h1>
        <p className='text-muted-foreground'>
          Manage your payment settings, view earnings, and access your payout
          dashboard.
        </p>
      </div>

      {/* Main Card */}
      <Card className='border-2'>
        <CardHeader className='space-y-1 pb-4'>
          <div className='flex items-center gap-3'>
            <div className='flex items-center justify-center size-12 rounded-full bg-primary/10'>
              <CreditCardIcon className='size-6 text-primary' />
            </div>
            <div>
              <CardTitle className='text-2xl'>Payment Dashboard</CardTitle>
              <CardDescription className='text-base'>
                Access your Stripe account to manage payouts and settings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid gap-4 sm:grid-cols-2'>
            {/* Feature 1 */}
            <div className='flex items-start gap-3 rounded-lg border p-4'>
              <div className='flex items-center justify-center size-10 rounded-md bg-green-600/10 shrink-0'>
                <TrendingUpIcon className='size-5 text-green-600' />
              </div>
              <div className='space-y-1'>
                <h3 className='font-semibold'>Track Earnings</h3>
                <p className='text-sm text-muted-foreground'>
                  View detailed reports of your course sales and revenue
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className='flex items-start gap-3 rounded-lg border p-4'>
              <div className='flex items-center justify-center size-10 rounded-md bg-blue-600/10 shrink-0'>
                <CreditCardIcon className='size-5 text-blue-600' />
              </div>
              <div className='space-y-1'>
                <h3 className='font-semibold'>Manage Payouts</h3>
                <p className='text-sm text-muted-foreground'>
                  Update payment methods and payout schedules
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className='pt-2'>
            <Button
              asChild
              size='lg'
              className='w-full sm:w-auto cursor-pointer group'
            >
              <a href={loginLink} target='_blank' rel='noopener noreferrer'>
                View Your Payments Dashboard
                <ExternalLinkIcon className='ml-2 size-4 transition-transform group-hover:translate-x-0.5' />
              </a>
            </Button>
          </div>

          {/* Footer Note */}
          <div className='rounded-lg bg-muted p-4'>
            <p className='text-sm text-muted-foreground'>
              <strong className='text-foreground'>Note:</strong> You will be
              redirected to Stripe to securely access your payment dashboard.
              All payment processing is handled by Stripe.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorPaymentsPage;
