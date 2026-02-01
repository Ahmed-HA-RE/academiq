'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const subscripToPlan = async (planName: string) => {
  const data = await auth.api.upgradeSubscription({
    body: {
      plan: planName,
      successUrl: '/account/billing',
      cancelUrl: '/pricing',
      returnUrl: '/pricing',
      disableRedirect: false,
    },
    headers: await headers(),
  });

  return data;
};
