'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const createBillingPortalSession = async () => {
  const data = await auth.api.createBillingPortal({
    body: {
      returnUrl: '/account?callbackUrl=subscription',
      customerType: 'user',
      locale: 'en',
    },
    headers: await headers(),
  });

  return data.url;
};
