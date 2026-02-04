'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getCurrentLoggedUser } from '../getUser';

export const subscribeToPlan = async (planName: string, successUrl: string) => {
  try {
    const user = await getCurrentLoggedUser();

    if (user?.role === 'admin') {
      throw new Error('Admins cannot subscribe to plans.');
    }

    const data = await auth.api.upgradeSubscription({
      body: {
        plan: planName,
        successUrl,
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
