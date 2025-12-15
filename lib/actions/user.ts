import { notFound } from 'next/navigation';
import { auth } from '../auth';
import { headers } from 'next/headers';
import { prisma } from '../prisma';
import { convertToPlainObject } from '../utils';
import { BillingInfo, PaymentResults } from '@/types';

export const getUserById = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    notFound();
  }

  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
  });

  if (!user) return notFound();

  return convertToPlainObject({
    ...user,
    billingInfo: user.billingInfo as BillingInfo,
    paymentResults: user.paymentResults as PaymentResults,
  });
};
