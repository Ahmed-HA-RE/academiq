'use server';

import { convertToPlainObject } from '../utils';
import { getCurrentLoggedInInstructor } from '../actions/instructor/getInstructor';
import { redirect } from 'next/navigation';
import { APP_NAME, APPLICATION_FEE_PERCENTAGE, SERVER_URL } from '../constants';
import resend, { domain } from '../resend';
import NotifyApplicant from '@/emails/NotifyApplicant';
import { getApplicationByUserId } from './instructor/application';
import { stripe } from '../stripe';
import { getMyCart } from './cart';
import { prisma } from '../prisma';

// Get stripe account by application user ID
export const getStripeAccountByApplication = async () => {
  const application = await getApplicationByUserId();

  if (application) {
    const account = await stripe.accounts.retrieve(application.stripeAccountId);
    return convertToPlainObject(account);
  }
};

// Get instructor's stripe account
export const getInstructorStripeAccount = async () => {
  const instructor = await getCurrentLoggedInInstructor();

  const account = await stripe.accounts.retrieve(instructor.stripeAccountId);

  if (!account) redirect('/instructor-dashboard');

  return convertToPlainObject(account);
};

// Create Stripe onboarding link
export const createStripeOnboardingLink = async (stripeAccountId: string) => {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      return_url: `${SERVER_URL}/teach/apply/payments/setup`,
      refresh_url: `${SERVER_URL}/teach/apply/payments/setup`,
      type: 'account_onboarding',
    });

    return { success: true, redirect: accountLink.url, message: '' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

// Notify applicant email
export const notifyApplicant = async ({
  userEmail,
  userName,
}: {
  userEmail: string;
  userName: string;
}) => {
  await resend.emails.send({
    from: `${APP_NAME} <support@${domain}>`,
    to: userEmail,
    subject: 'Complete Your Payment Setup',
    react: NotifyApplicant({ name: userName }),
  });
};

// Create Stripe payout login link
export const createStripePayoutsLoginLink = async () => {
  const instructor = await getCurrentLoggedInInstructor();

  if (!instructor) throw new Error('Instructor not found');

  const loginLink = await stripe.accounts.createLoginLink(
    instructor.stripeAccountId,
  );

  return loginLink.url;
};

// Create stripe payment intent for the cart
export const createPaymentIntent = async (orderId: string) => {
  const cart = await getMyCart();

  if (!cart) {
    throw new Error('No cart found');
  }

  for (const item of cart.cartItems) {
    const course = await prisma.course.findUnique({
      where: { id: item.courseId },
      select: { instructor: { select: { stripeAccountId: true } } },
    });

    if (!course?.instructor.stripeAccountId) continue;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(item.price) * 100),
      application_fee_amount: Math.round(
        (Number(item.price) * APPLICATION_FEE_PERCENTAGE) / 100,
      ),
      currency: 'aed',
      transfer_data: {
        destination: course.instructor.stripeAccountId,
      },
      metadata: {
        orderId,
      },
    });

    if (!paymentIntent.client_secret) {
      throw new Error('Failed to create payment intent');
    }

    return paymentIntent.id;
  }
};

// Get stripe client secret for payment
export const getClientSecret = async (paymentIntentId: string | null) => {
  if (!paymentIntentId) throw new Error('Payment Intent ID is required');
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (!paymentIntent || !paymentIntent.client_secret)
    throw new Error('Payment Intent not found');

  return paymentIntent.client_secret;
};
