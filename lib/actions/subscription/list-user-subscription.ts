'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getCurrentLoggedUser } from '../getUser';
import { prisma } from '@/lib/prisma';

export const listUserSubscription = async () => {
  const user = await getCurrentLoggedUser();

  if (!user) return null;

  const userSubscription = await prisma.subscription.findFirst({
    where: {
      stripeCustomerId: user.stripeCustomerId,
    },
    select: { referenceId: true },
  });

  if (!userSubscription) return null;

  const subscriptions = await auth.api.listActiveSubscriptions({
    query: {
      referenceId: userSubscription.referenceId,
      customerType: 'user',
    },
    headers: await headers(),
  });

  // get the active subscription
  const activeSubscription = subscriptions.find(
    (sub) => sub.status === 'active' || sub.status === 'trialing',
  );

  // Check subscription limits
  const projectLimit = subscriptions[0].limits?.projects || 0;

  return activeSubscription;
};
