'use server';

import stripe from '@/lib/stripe';

export const getOrderReceipt = async (paymentIntentId: string) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  const charge = await stripe.charges.retrieve(
    paymentIntent.latest_charge as string,
  );

  return charge.receipt_url;
};
