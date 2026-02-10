'use server';

import stripe from '@/lib/stripe';
import { getCurrentLoggedUser } from '../getUser';

export const getAllSubscriptions = async () => {
  const user = await getCurrentLoggedUser();

  if (!user || user.role !== 'admin') throw new Error('Unauthorized');

  let subscriptionsAmount = 0;

  for await (const subscription of stripe.subscriptions.list({ limit: 100 })) {
    if (subscription.status === 'active') {
      subscriptionsAmount += subscription.items.data.reduce(
        (acc, c) => acc + c.price.unit_amount! / 100,
        0,
      );
    }
  }
  return subscriptionsAmount.toFixed(2);
};
