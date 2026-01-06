import { SERVER_URL } from '@/lib/constants';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import Link from 'next/link';
import { getCurrentLoggedUser } from '@/lib/actions/user';
import { getApplicationByUserId } from '@/lib/actions/instructor/application';
import { getStripeAccountByApplication } from '@/lib/actions/instructor';

const CTASection = async () => {
  const [user, application, account] = await Promise.all([
    getCurrentLoggedUser(),
    getApplicationByUserId(),
    getStripeAccountByApplication(),
  ]);

  return (
    <section className='bg-linear-to-t from-[#f12711] to-[#f5af19] bg-primary section-spacing'>
      <div className='container'>
        <Card className='bg-0 rounded-none border-0 shadow-none p-0'>
          <CardContent className='flex justify-between gap-6 max-lg:flex-col px-0 lg:items-center'>
            <div className='space-y-4'>
              <h2 className='text-white text-2xl font-semibold md:text-3xl lg:text-4xl'>
                Complete Your Setup to Start Teaching
              </h2>
              <p className='text-white text-lg md:text-xl'>
                Follow our guides to finish your application, set up payments,
                and start teaching confidently.
              </p>
            </div>
            <div>
              <Button
                asChild
                size='lg'
                className='cursor-pointer text-base sm:text-lg bg-[#ff9123] hover:opacity-95 hover:bg-0 text-white rounded-lg sm:h-13'
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
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CTASection;
