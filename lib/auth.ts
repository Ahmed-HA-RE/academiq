import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
import { nextCookies } from 'better-auth/next-js';
import { emailOTP } from 'better-auth/plugins';
import { APP_NAME } from './constants';
import resend from './resend';
import VerificationOTP from '@/emails/VerificationOTP';

const domain = process.env.RESEND_DOMAIN;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  plugins: [
    nextCookies(),
    emailOTP({
      async sendVerificationOTP({ type, email, otp }) {
        if (type === 'email-verification') {
          await resend.emails.send({
            from: `${APP_NAME} <support@${domain}>`,
            to: email,
            subject: 'Verify your email address',
            react: VerificationOTP({
              verificationCode: otp,
              title: 'Confirm your email address',
              description:
                'Please use the following code to verify your email address.',
            }),
          });
        } else if (type === 'forget-password') {
          await resend.emails.send({
            from: `${APP_NAME} <support@${domain}>`,
            to: email,
            subject: 'Reset your password',
            react: VerificationOTP({
              verificationCode: otp,
              title: 'Reset your password',
              description:
                'Please use the following code to reset your password.',
            }),
          });
        }
      },
      expiresIn: 7200, // 120 minutes
      sendVerificationOnSignUp: true,
      allowedAttempts: 3,
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
      status: {
        type: 'string',
        defaultValue: 'online',
        input: false,
      },
    },
  },
});
