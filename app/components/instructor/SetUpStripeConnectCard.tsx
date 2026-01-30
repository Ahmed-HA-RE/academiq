'use client';

import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';
import Stripe from 'stripe';
import { useTransition } from 'react';
import { createStripeOnboardingLink } from '@/lib/actions/stripe.action';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Spinner } from '../ui/spinner';
import Link from 'next/link';

const benefits = [
  'Receive payments directly to your bank account',
  'Track earnings and transactions in real-time',
  'Secure and encrypted payment processing',
  'Automatic payout scheduling',
];

const SetUpStripeConnectCard = ({ account }: { account: Stripe.Account }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSetup = () => {
    startTransition(async () => {
      const res = await createStripeOnboardingLink(account.id);

      if (!res.success) {
        toast.error(res.message);
        return;
      } else if (res.redirect) {
        router.push(res.redirect);
      }
    });
  };

  const isFirstCreatedAccount = !account.details_submitted;

  const isAccountSubmittedButIncomplete =
    account.details_submitted &&
    ((account.requirements?.currently_due &&
      account.requirements?.currently_due.length > 0) ||
      (account.requirements?.errors &&
        account.requirements?.errors?.length > 0));

  const isAccountComplete =
    account.requirements?.currently_due?.length === 0 &&
    account.charges_enabled &&
    account.payouts_enabled;

  return (
    <div className='flex items-center justify-center col-span-4 py-8 md:py-12'>
      <div className='w-full max-w-lg'>
        <Image
          src={'/svg/stripe.svg'}
          alt='Stripe logo'
          width={100}
          height={100}
          className='mx-auto mb-4'
        />
        <h2 className='text-3xl font-semibold text-center mb-2'>
          {isFirstCreatedAccount
            ? 'Set Up Your Stripe Account'
            : isAccountSubmittedButIncomplete
              ? 'Complete Your Stripe Information'
              : 'Setup is Complete'}
        </h2>
        <p className='text-center text-muted-foreground md:text-lg'>
          {isFirstCreatedAccount
            ? 'To start receiving payments, please complete your Stripe setup.'
            : isAccountSubmittedButIncomplete
              ? 'Please complete the required information or upload valid documents to enable payouts.'
              : 'Your Stripe account is set up successfully.'}
        </p>
        {/* Benefits */}
        <ul className='flex flex-col gap-2 items-start justify-center mt-10'>
          {benefits.map((benefit) => (
            <li
              key={benefit}
              className='flex items-center gap-2 text-sm md:text-base'
            >
              <CheckCircle2 className='size-5 md:size-6 text-[#5167FC]' />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        {/* CTA */}
        <div className='mt-8 space-y-4'>
          {!isAccountComplete ? (
            <Button
              size='lg'
              className='cursor-pointer bg-[#5167FC] hover:opacity-95 hover:bg-0 text-white w-full group'
              onClick={handleSetup}
              disabled={isPending}
            >
              {isPending ? (
                <Spinner className='size-6' />
              ) : (
                <>
                  {isFirstCreatedAccount
                    ? 'Set Up Your Stripe Account'
                    : isAccountSubmittedButIncomplete
                      ? 'Complete Your Stripe Information'
                      : 'Setup is Complete'}
                  <ArrowRight className='size-4 -me-1 opacity-60 transition-transform group-hover:translate-x-0.5' />
                </>
              )}
            </Button>
          ) : (
            <Button
              size='lg'
              className='cursor-pointer bg-[#5167FC] hover:opacity-95 hover:bg-0 text-white w-full group'
              asChild
            >
              <Link href={'/application/status'}>
                Review Application Status
                <ArrowRight className='size-4 -me-1 opacity-60 transition-transform group-hover:translate-x-0.5' />
              </Link>
            </Button>
          )}
          <p className='text-muted-foreground text-xs text-center'>
            Powered by{' '}
            <span className='font-semibold text-[#5167FC]'>Stripe</span> -
            Secure payment processing.
            <a
              href='https://stripe.com/ae/connect'
              target='_blank'
              className='ml-1 font-semibold text-[#5167FC] underline'
            >
              Read more
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetUpStripeConnectCard;
