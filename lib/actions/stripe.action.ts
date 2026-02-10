'use server';

import { convertToFils, convertToPlainObject } from '../utils';
import { getCurrentLoggedInInstructor } from '../actions/instructor/getInstructor';
import { redirect } from 'next/navigation';
import { APP_NAME, APPLICATION_FEE_PERCENTAGE, SERVER_URL } from '../constants';
import resend, { domain } from '../resend';
import NotifyApplicant from '@/emails/NotifyApplicant';
import { getApplicationByUserId } from './instructor/application';
import { stripe } from '../stripe';
import { getCurrentLoggedUser } from './getUser';
import { prisma } from '../prisma';
import Stripe from 'stripe';

// Create stripe checkout session for course enrollment
export const createStripeCheckoutSession = async (data: {
  courseId: string;
  pathname: string;
}) => {
  try {
    const user = await getCurrentLoggedUser();

    if (!user) throw new Error('You must be logged in to purchase a course');

    // Find the course details to get the price and instructor info
    const course = await prisma.course.findUnique({
      where: { id: data.courseId },
      include: { instructor: { select: { stripeAccountId: true } } },
    });

    if (!course) throw new Error('Course not found');

    const application_fee = Math.round(
      Number(course.price) * (APPLICATION_FEE_PERCENTAGE / 100) * 100,
    ); // Convert AED to fils

    const isCoursesPage = data.pathname.includes('/courses')
      ? '/courses'
      : `/course/${data.courseId}`;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: 'aed',
          unit_amount: convertToFils(course.price),
          tax_behavior: 'exclusive',
          product_data: {
            name: course.title,
            description: course.shortDesc,
            images: [course.image],
            tax_code: 'txcd_10504003',
          },
        },
      },
    ];
    const session = await stripe.checkout.sessions.create({
      success_url: `${SERVER_URL}/success?checkout_session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SERVER_URL}${isCoursesPage}`,
      line_items: lineItems,
      mode: 'payment',
      metadata: {
        courseId: course.id,
        userId: user.id,
      },
      payment_intent_data: {
        application_fee_amount: application_fee,
        transfer_data: {
          destination: course.instructor.stripeAccountId,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_update: {
        address: 'auto',
      },
      currency: 'aed',
      customer: user.stripeCustomerId as string,
      saved_payment_method_options: {
        payment_method_save: 'enabled',
      },
      invoice_creation: {
        enabled: true,
      },
      automatic_tax: { enabled: true },
    });

    return { success: true, redirect: session.url };
  } catch (error) {
    console.log(error);
    return { success: false, redirect: null };
  }
};

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

// Get stripe client secret for payment
export const getClientSecret = async (paymentIntentId: string | null) => {
  if (!paymentIntentId) throw new Error('Payment Intent ID is required');
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (!paymentIntent || !paymentIntent.client_secret)
    throw new Error('Payment Intent not found');

  return paymentIntent.client_secret;
};
