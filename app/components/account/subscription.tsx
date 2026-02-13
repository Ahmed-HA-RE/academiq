'use client';
import { useTransition } from 'react';
import { Button } from '../ui/button';
import { createBillingPortalSession } from '@/lib/actions/subscription/create-billing-portal';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, CreditCard, Crown, Sparkles } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Badge } from '../ui/badge';
import { Spinner } from '../ui/spinner';

const Subscription = ({
  subscription,
}: {
  subscription: {
    referenceId: string;
    plan: string;
    stripeSubscriptionId?: string;
  } | null;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const isInstructorDashboard = pathname.startsWith('/instructor-dashboard')
    ? '/instructor-dashboard/settings/subscription'
    : '/account?callbackUrl=subscription';

  const handleBillingPortal = async () => {
    startTransition(async () => {
      const res = await createBillingPortalSession(isInstructorDashboard);
      router.push(res);
    });
  };

  return !subscription ? (
    <div className='flex flex-col lg:flex-row items-start gap-5'>
      <div className='space-y-3 lg:flex-1/4'>
        <h3 className='text-xl font-semibold'>Subscription</h3>
        <p className='text-muted-foreground text-sm lg:max-w-md'>
          Subscribe to unlock unlimited access to all courses and premium
          features.
        </p>
      </div>
      <Card className='lg:flex-1/2 w-full border-dashed border-2'>
        <CardContent className='pt-6'>
          <div className='flex flex-col items-center justify-center py-8 text-center space-y-4'>
            <div className='rounded-full bg-muted p-4'>
              <Sparkles className='h-8 w-8 text-muted-foreground' />
            </div>
            <div className='space-y-2'>
              <h4 className='text-lg font-semibold'>No Active Subscription</h4>
              <p className='text-sm text-muted-foreground max-w-sm'>
                You don&apos;t have an active subscription yet. Choose a plan to
                get unlimited access to all our courses.
              </p>
            </div>
            <Button
              className='group bg-primary hover:bg-primary-hover dark:bg-lime-600 dark:hover:bg-lime-700 text-white mt-4'
              asChild
            >
              <Link href='/pricing'>
                View Available Plans
                <ArrowLeftIcon
                  aria-hidden='true'
                  className='ml-2 opacity-60 transition-transform group-hover:translate-x-0.5 rotate-180'
                  size={16}
                />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className='flex flex-col lg:flex-row items-start gap-5'>
      <div className='space-y-3 lg:flex-1/4'>
        <h3 className='text-xl font-semibold'>Subscription</h3>
        <p className='text-muted-foreground text-sm lg:max-w-md'>
          Manage your subscription, billing details, and payment methods.
        </p>
      </div>
      <Card className='lg:flex-1/2 w-full border-lime-500/20 bg-gradient-to-br from-lime-50/50 to-transparent dark:from-lime-950/20'>
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div className='space-y-1'>
              <CardTitle className='flex items-center gap-2'>
                <Crown className='h-5 w-5 text-lime-600 dark:text-lime-500' />
                Active Subscription
              </CardTitle>
              <CardDescription>
                You have full access to all premium features
              </CardDescription>
            </div>
            <Badge className='bg-primary hover:bg-primary-hover dark:bg-lime-600 dark:hover:bg-lime-700 text-white'>
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between p-4 rounded-lg bg-white dark:bg-gray-900 border'>
              <div className='flex items-center gap-3'>
                <div className='rounded-full bg-lime-100 dark:bg-lime-900 p-2'>
                  <CreditCard className='h-5 w-5 text-lime-600 dark:text-lime-500' />
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Current Plan</p>
                  <p className='font-semibold text-xl capitalize text-lime-600 dark:text-lime-500'>
                    {subscription.plan}
                  </p>
                </div>
              </div>
            </div>

            <div className='flex items-center gap-2 p-4 rounded-lg bg-muted/50'>
              <Sparkles className='h-4 w-4 text-lime-600 dark:text-lime-500' />
              <p className='text-sm text-muted-foreground'>
                Unlimited access to all courses and materials
              </p>
            </div>
          </div>

          <Button
            className='w-full bg-primary hover:bg-primary-hover dark:bg-lime-600 dark:hover:bg-lime-700 text-white cursor-pointer'
            disabled={isPending}
            onClick={handleBillingPortal}
          >
            {isPending ? (
              <Spinner className='size-6' />
            ) : (
              'Manage Subscription & Billing'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscription;
