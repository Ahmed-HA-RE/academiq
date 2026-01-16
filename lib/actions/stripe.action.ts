'use server';

import { convertToPlainObject } from '../utils';
import { getCurrentLoggedInInstructor } from '../actions/instructor/getInstructor';
import { redirect } from 'next/navigation';
import { APP_NAME, SERVER_URL } from '../constants';
import resend, { domain } from '../resend';
import NotifyApplicant from '@/emails/NotifyApplicant';
import { getApplicationByUserId } from './instructor/application';
import { stripe } from '../stripe';

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
export const notifyApplicant = async (userEmail: string) => {
  await resend.emails.send({
    from: `${APP_NAME} <support@${domain}>`,
    to: userEmail,
    subject: 'Complete Your Payment Setup',
    react: NotifyApplicant(),
  });
};

// Create Stripe payout login link
export const createStripePayoutsLoginLink = async () => {
  const instructor = await getCurrentLoggedInInstructor();

  if (!instructor) throw new Error('Instructor not found');

  const loginLink = await stripe.accounts.createLoginLink(
    instructor.stripeAccountId
  );

  return loginLink.url;
};
