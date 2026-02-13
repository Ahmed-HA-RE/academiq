import { headers } from 'next/headers';
import Footer from '../components/Footer';

import { auth } from '@/lib/auth';
import { signUserToken } from '@knocklabs/node';
import stripe from '@/lib/stripe';
import { convertToPlainObject } from '@/lib/utils';
import Header from '@/app/components/header';

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let userToken = '';

  if (session) {
    userToken = await signUserToken(session?.user.id);
  }

  const activeCoupon = convertToPlainObject(
    await stripe.coupons.list({
      limit: 1,
    }),
  );

  return (
    <div className='min-h-screen flex flex-col overflow-hidden'>
      <Header
        session={session}
        activeCoupon={activeCoupon}
        userToken={userToken}
      />
      <main className='w-full flex-grow'>{children}</main>
      <Footer />
    </div>
  );
};

export default RootLayout;
