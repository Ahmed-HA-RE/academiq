'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const createBillingPortalSession = async (returnUrl: string) => {
  const data = await auth.api.createBillingPortal({
    body: {
      returnUrl,
      customerType: 'user',
      locale: 'en',
    },
    headers: await headers(),
  });

  return data.url;
};
