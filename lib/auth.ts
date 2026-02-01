import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
import { nextCookies } from 'better-auth/next-js';
import { emailOTP, admin, createAuthMiddleware } from 'better-auth/plugins';
import { APP_NAME } from './constants';
import resend from './resend';
import VerificationOTP from '@/emails/VerificationOTP';
import ResetPasswordEmail from '@/emails/ResetPassword';
import { domain } from './resend';
import { stripe } from '@better-auth/stripe';
import { stripe as stripeClient } from './stripe';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const query = ctx.query;
      if (query && query.error === 'banned')
        return ctx.redirect(`/banned?error=${query.error_description}`);
    }),
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 6,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: `${APP_NAME} <no-reply@${domain}>`,
        replyTo: process.env.REPLY_EMAIL,
        to: user.email,
        subject: 'Reset your password',
        react: ResetPasswordEmail({
          userName: user.name,
          resetPasswordLink: url,
        }),
      });
    },
    resetPasswordTokenExpiresIn: 3600, // 60 minutes
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: 'select_account',
      overrideUserInfoOnSignIn: true,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      prompt: 'select_account',
      overrideUserInfoOnSignIn: true,
    },
  },

  plugins: [
    nextCookies(),
    emailOTP({
      async sendVerificationOTP({ type, email, otp }) {
        if (type === 'email-verification') {
          await resend.emails.send({
            from: `${APP_NAME} <support@${domain}>`,
            to: email,
            replyTo: process.env.REPLY_EMAIL,
            subject: 'Verify your email address',
            react: VerificationOTP({
              verificationCode: otp,
              title: 'Confirm your email address',
              description:
                'Please use the following code to verify your email address.',
            }),
          });
        }
      },
      expiresIn: 7200, // 120 minutes
      sendVerificationOnSignUp: true,
      overrideDefaultEmailVerification: true,
      allowedAttempts: 3,
    }),
    admin(),

    stripe({
      stripeClient,
      stripeWebhookSecret:
        process.env.NODE_ENV === 'development'
          ? process.env.STRIPE_WEBHOOK_DEV_SECRET!
          : process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      onCustomerCreate: async ({ stripeCustomer, user }) => {
        console.log(
          `Customer ${stripeCustomer.id} created for user ${user.id}`,
        );
      },
      subscription: {
        enabled: true,
        plans: [
          {
            name: 'Basic',
            priceId: process.env.STRIPE_BASIC_PRICE_ID,
          },
          {
            name: 'Pro',
            priceId: process.env.STRIPE_PRO_PRICE_ID,
          },
        ],
      },
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
  },

  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user',
        input: false,
      },
    },
  },
});
