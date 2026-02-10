'use server';
import { knock } from '@/lib/knock';
import { capitalizeFirstLetter } from '@/lib/utils';

export const welcomeWorkFlow = async (userId: string) => {
  await knock.workflows.trigger('welcome-message', {
    recipients: [userId],
    actor: 'academiq-support',
  });
};

// Send notification to user about successful subscription
export const sendSubscriptionCompleteNotification = async (
  userId: string,
  planName: string,
) => {
  await knock.workflows.trigger('subscription-complete', {
    recipients: [userId as string],
    actor: 'academiq-support',
    data: {
      planName: capitalizeFirstLetter(planName),
    },
  });
};

// Send notification to user about purchasing course
export const sendInstructorCoursePurchaseNotification = async (
  userId: string,
  courseTitle: string,
) => {
  await knock.workflows.trigger('course-sold', {
    actor: 'academiq-support',
    recipients: [userId],
    data: { courseName: courseTitle },
  });
};

// Send notification to user about the new purchase
export const sendUserCoursePurchaseNotification = async (
  userId: string,
  courseTitle: string,
) => {
  await knock.workflows.trigger('purchase-course', {
    actor: 'academiq-support',
    recipients: [userId],
    data: {
      courseName: courseTitle,
    },
  });
};

// Send notification to instructor about the refund
export const sendInstructorRefundNotification = async (
  amount: number,
  userId: string,
) => {
  await knock.workflows.trigger('transfer-reversal-instructor', {
    recipients: [userId],
    actor: 'academiq-support',
    data: {
      amount,
    },
  });
};

// Send notification to user about the refund
export const sendUserRefundNotification = async (
  userId: string,
  courseName: string,
) => {
  await knock.workflows.trigger('refund-user', {
    recipients: [userId],
    actor: 'academiq-support',
    data: {
      courseName,
    },
  });
};
