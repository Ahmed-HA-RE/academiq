'use client';

import { ArrowRightIcon } from 'lucide-react';

import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';

import { capitalizeFirstLetter, cn } from '@/lib/utils';
import { NumberTicker } from '../ui/number-ticker';
import { PLANS, SERVER_URL } from '@/lib/constants';
import { subscribeToPlan } from '@/lib/actions/subscription/mutation-subscription';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { User } from '@/types';
import Link from 'next/link';
import { authClient } from '@/lib/authClient';

type PricingProps = {
  userSubscription: {
    referenceId: string;
    plan: string;
    stripeSubscriptionId?: string;
  } | null;
  user?: User;
};

const Pricing = ({ userSubscription, user }: PricingProps) => {
  const isInstructor =
    user?.role === 'instructor'
      ? '/instructor-dashboard/settings/subscription'
      : '/account?callbackUrl=subscription';

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const userPlan = (plan: string) => {
    if (userSubscription) {
      if (userSubscription.plan === plan) {
        return 'Current Plan';
      } else {
        return `Switch to ${capitalizeFirstLetter(plan)}`;
      }
    } else {
      return `Choose ${capitalizeFirstLetter(plan)}`;
    }
  };

  const handleSubscribe = (planName: string) => {
    startTransition(async () => {
      if (userSubscription) {
        const res = await authClient.subscription.upgrade({
          plan: planName,
          successUrl: '/account/?callbackUrl=subscription',
          cancelUrl: '/pricing',
          returnUrl: '/pricing',
          disableRedirect: false,
          subscriptionId: userSubscription.stripeSubscriptionId,
        });

        if (!res || !res.data?.url) {
          toast.error('Failed to switch plan. Please try again.');
          return;
        }

        router.push(res.data.url);
      } else {
        const res = await subscribeToPlan(planName, isInstructor);
        if (!res.success || !res.url) {
          toast.error(res.message);
          return;
        }

        router.push(res.url);
      }
    });
  };

  return (
    <section className='section-after-header'>
      <div className='container space-y-12 sm:space-y-16 lg:gap-24 lg:space-y-24 '>
        <div className='flex flex-col items-center gap-4 text-center'>
          <h2 className='text-4xl font-semibold sm:text-5xl lg:text-6xl'>
            Plans and Pricing
          </h2>
          <p className='text-secondary-foreground text-base sm:text-lg lg:text-xl max-w-lg leading-relaxed'>
            Find the ideal plan that fits your budget and goals. Make informed
            choices with ease.
          </p>
        </div>
        <div className='flex flex-col items-center justify-center gap-0 space-y-8 lg:flex-row'>
          {PLANS.map((plan, index) => (
            <div className='max-w-lg flex-1' key={index}>
              <Card
                key={index}
                className={cn('py-8 shadow-md border-r-0', {
                  'bg-primary border-none': plan.isHighlighted,
                  'lg:rounded-r-none': index === 0,
                  'lg:rounded-l-none': index === 2,
                })}
              >
                <CardContent className='flex flex-col gap-8 px-8'>
                  <div className='flex flex-col gap-4'>
                    <div className='flex flex-row items-center justify-between'>
                      <h3
                        className={cn(
                          'text-3xl font-bold text-secondary-foreground',
                          {
                            'text-primary-foreground': plan.isHighlighted,
                          },
                        )}
                      >
                        {capitalizeFirstLetter(plan.name)}
                      </h3>

                      {userSubscription?.plan === plan.name && (
                        <span className='bg-primary text-white dark:text-black px-3 py-1.5 rounded-full text-sm font-medium'>
                          Current Plan
                        </span>
                      )}

                      {plan.popular && !userSubscription && (
                        <span className='bg-white/20 text-white dark:text-black px-3 py-1.5 rounded-full text-sm font-medium'>
                          {plan.popular ? 'Most Popular' : 'Current Plan'}
                        </span>
                      )}
                    </div>

                    <div className='flex gap-1.5'>
                      <span
                        className={cn(
                          'text-lg font-medium dirham-symbol !text-secondary-foreground',
                          plan.isHighlighted && '!text-primary-foreground',
                        )}
                      >
                        &#xea;
                      </span>
                      <span
                        className={cn(
                          'text-5xl font-semibold text-secondary-foreground',
                          {
                            'text-primary-foreground': plan.isHighlighted,
                          },
                        )}
                      >
                        <NumberTicker startValue={0} value={plan.price} />
                      </span>
                      <span
                        className={cn(
                          'self-end pb-1 text-lg font-medium text-secondary-foreground ',
                          plan.isHighlighted && '!text-primary-foreground',
                        )}
                      >
                        /{plan.billCycle}
                      </span>
                    </div>

                    <p
                      className={cn('text-secondary-foreground', {
                        'text-primary-foreground': plan.isHighlighted,
                      })}
                    >
                      {plan.description}
                    </p>
                  </div>

                  <div className='flex flex-col gap-3'>
                    {plan.features.map((feature, i) => (
                      <div key={i} className='flex items-start gap-3'>
                        <div
                          className={cn(
                            'bg-secondary-foreground flex size-5 items-center justify-center rounded-md mt-0.5',
                            {
                              'bg-white': plan.isHighlighted,
                            },
                          )}
                        >
                          <svg
                            className={cn('size-3.5 text-white', {
                              'text-secondary-foreground': plan.isHighlighted,
                            })}
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M5 13l4 4L19 7'
                            />
                          </svg>
                        </div>
                        <span
                          className={cn(
                            'text-sm leading-relaxed text-secondary-foreground',
                            {
                              'text-primary-foreground': plan.isHighlighted,
                            },
                          )}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {user ? (
                    <Button
                      size='lg'
                      className={cn(
                        'rounded-md cursor-pointer text-base group',
                        plan.isHighlighted
                          ? 'bg-white text-black hover:bg-0'
                          : 'bg-slate-700 text-white hover:bg-slate-800 ',
                      )}
                      variant={'secondary'}
                      disabled={
                        isPending ||
                        userSubscription?.plan === plan.name ||
                        userSubscription?.plan === 'pro' // Prevent downgrading from pro to basic
                      }
                      onClick={() => handleSubscribe(plan.name)}
                    >
                      {userPlan(plan.name)}
                      {!userSubscription && (
                        <ArrowRightIcon
                          aria-hidden='true'
                          className='-ms-1 group-hover:translate-x-0.5 transition-transform size-4.5'
                        />
                      )}
                    </Button>
                  ) : (
                    <Button
                      size='lg'
                      className={cn(
                        'rounded-md cursor-pointer text-base group',
                        plan.isHighlighted
                          ? 'bg-muted'
                          : 'bg-lime-500 dark:bg-lime-600 text-white hover:bg-lime-600 dark:hover:bg-lime-700',
                      )}
                      variant={'secondary'}
                      disabled={isPending}
                      asChild
                    >
                      <Link href={`/login?callbackUrl=${SERVER_URL}/pricing`}>
                        Login to Subscribe
                        <ArrowRightIcon
                          aria-hidden='true'
                          className='-ms-1 group-hover:translate-x-0.5 transition-transform size-4.5'
                        />
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
