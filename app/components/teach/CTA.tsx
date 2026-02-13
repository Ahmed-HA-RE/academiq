import { SERVER_URL } from '@/lib/constants';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import Link from 'next/link';
import { getCurrentLoggedUser } from '@/lib/actions/getUser';
import { getApplicationByUserId } from '@/lib/actions/instructor/application';
import { getStripeAccountByApplication } from '@/lib/actions/stripe.action';
import { MotionPreset } from '../ui/motion-preset';

const CTASection = async () => {
  const [user, application, account] = await Promise.all([
    getCurrentLoggedUser(),
    getApplicationByUserId(),
    getStripeAccountByApplication(),
  ]);

  return (
    <section className='section-spacing'>
      <MotionPreset
        component='div'
        className='container'
        fade
        slide={{ direction: 'up', offset: 50 }}
        blur
        transition={{ duration: 0.8 }}
      >
        <Card className='rounded-3xl border-none py-10 shadow-none sm:py-16 lg:py-24 bg-[url(/images/cta-image.png)] bg-cover bg-center bg-no-repeat 2xl:scale-115'>
          <CardContent className='flex flex-col items-center justify-between gap-8 px-8 sm:px-16 xl:px-24'>
            <div className='flex-1/2 space-y-4'>
              <h2 className='text-3xl text-center md:text-5xl font-bold text-black'>
                Complete Your Setup to Start Teaching
              </h2>
              <p className='text-black text-xl md:text-2xl text-center'>
                Follow our guides to finish your application, set up payments,
                and start teaching confidently.
              </p>
            </div>
            <Button
              asChild
              size='lg'
              className='p-6 rounded-full w-full max-w-xs text-base bg-primary text-primary-foreground hover:bg-primary-hover'
            >
              <Link
                href={
                  !user
                    ? `/login?callbackUrl=${SERVER_URL}/teach/apply`
                    : application &&
                        application.userId === user.id &&
                        user.role !== 'instructor' &&
                        application.status === 'pending' &&
                        account &&
                        account.payouts_enabled
                      ? '/application/status'
                      : application &&
                          application.userId === user.id &&
                          account &&
                          !account.payouts_enabled &&
                          application.status === 'pending'
                        ? '/teach/apply/payments/setup'
                        : application &&
                            application.userId === user.id &&
                            user.role === 'instructor'
                          ? '/instructor-dashboard'
                          : '/teach/apply'
                }
              >
                {!user
                  ? 'Please log in to apply'
                  : application &&
                      application.userId === user.id &&
                      user.role !== 'instructor' &&
                      application.status === 'pending' &&
                      account &&
                      account.payouts_enabled
                    ? 'View Application Status'
                    : application &&
                        application.userId === user.id &&
                        account &&
                        !account.payouts_enabled &&
                        application.status === 'pending'
                      ? 'Complete Payment Setup'
                      : application &&
                          application.userId === user.id &&
                          user.role === 'instructor'
                        ? 'Go to Instructor Dashboard'
                        : 'Apply Now'}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </MotionPreset>
    </section>
  );
};

export default CTASection;
