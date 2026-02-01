import { ArrowRightIcon } from 'lucide-react';

import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';

import { cn } from '@/lib/utils';
import { NumberTicker } from '../ui/number-ticker';

const plans = [
  {
    name: 'Basic',
    price: 100,
    description:
      'Ideal for learners who want flexible monthly access to high-quality courses and community support.',
    features: [
      'Access to all available courses',
      'HD video streaming',
      'Learn at your own pace',
      'Community support & discussions',
      'Instructor answers via community',
      'Downloadable learning resources',
    ],
    billCycle: 'month',
  },
  {
    name: 'Pro',
    price: 900,
    description:
      'Best value for committed learners. Get unlimited access for a full year and save 300 AED compared to monthly billing.',
    features: [
      'Unlimited access to all courses',
      'Save 300 AED compared to monthly plan (25%)',
      'Priority support from instructors',
      'Faster responses in community discussions',
      'HD video streaming',
      'Access to all future courses during your plan',
      'Downloadable learning resources',
    ],
    billCycle: 'year',
    isHighlighted: true,
    popular: true,
  },
];

const Pricing = () => {
  return (
    <section className='section-spacing'>
      <div className='container space-y-12 sm:space-y-16 lg:gap-24 lg:space-y-24 '>
        <div className='flex flex-col items-center gap-4 text-center'>
          <h2 className='text-4xl font-semibold sm:text-5xl lg:text-6xl'>
            Plans and Pricing
          </h2>
          <p className='text-muted-foreground text-base sm:text-lg lg:text-xl max-w-lg leading-relaxed'>
            Find the ideal plan that fits your budget and goals. Make informed
            choices with ease.
          </p>
        </div>
        <div className='flex flex-col items-center justify-center gap-0 space-y-8 lg:flex-row'>
          {plans.map((plan, index) => (
            <div className='max-w-lg flex-1' key={index}>
              <Card
                key={index}
                className={cn('py-8 shadow-md border-r-0', {
                  'bg-lime-500 dark:bg-lime-600 border-none':
                    plan.isHighlighted,
                  'lg:rounded-r-none': index === 0,
                  'lg:rounded-l-none': index === 2,
                })}
              >
                <CardContent className='flex flex-col gap-8 px-8'>
                  <div className='flex flex-col gap-4'>
                    <div className='flex flex-row items-center justify-between'>
                      <h3
                        className={cn('text-3xl font-bold', {
                          'text-primary-foreground': plan.isHighlighted,
                        })}
                      >
                        {plan.name}
                      </h3>
                      {plan.popular && (
                        <span className='bg-white/20 text-white dark:text-black px-3 py-1.5 rounded-full text-sm font-medium'>
                          Most Popular
                        </span>
                      )}
                    </div>

                    <div className='flex gap-1.5'>
                      <span
                        className={cn(
                          'text-lg font-medium dirham-symbol',
                          plan.isHighlighted && '!text-primary-foreground',
                        )}
                      >
                        &#xea;
                      </span>
                      <span
                        className={cn('text-5xl font-semibold', {
                          'text-primary-foreground': plan.isHighlighted,
                        })}
                      >
                        <NumberTicker startValue={0} value={plan.price} />
                      </span>
                      <span
                        className={cn(
                          'self-end pb-1 text-lg font-medium',
                          plan.isHighlighted && '!text-primary-foreground',
                        )}
                      >
                        /{plan.billCycle}
                      </span>
                    </div>

                    <p
                      className={cn('text-muted-foreground', {
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
                            'bg-lime-500 dark:bg-lime-600 flex size-5 items-center justify-center rounded-md mt-0.5',
                            {
                              'bg-white dark:bg-gray-900': plan.isHighlighted,
                            },
                          )}
                        >
                          <svg
                            className={cn('size-3.5 text-white', {
                              'text-lime-500 dark:text-lime-400':
                                plan.isHighlighted,
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
                          className={cn('text-sm leading-relaxed', {
                            'text-primary-foreground': plan.isHighlighted,
                          })}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    size='lg'
                    className={cn(
                      'rounded-md cursor-pointer text-base group',
                      plan.isHighlighted
                        ? 'bg-muted'
                        : 'bg-lime-500 dark:bg-lime-600 text-white hover:bg-lime-600 dark:hover:bg-lime-700',
                    )}
                    variant={'secondary'}
                  >
                    Get started
                    <ArrowRightIcon
                      aria-hidden='true'
                      className='-ms-1 group-hover:translate-x-0.5 transition-transform size-4.5'
                    />
                  </Button>
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
