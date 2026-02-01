'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const subscribeToPlan = async (planName: string) => {
  try {
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

    return {
      success: true,
      message: 'Subscription created successfully',
      url: data.url,
    };
  } catch (error) {
    return { success: false, message: (error as Error).message, url: null };
  }
};
