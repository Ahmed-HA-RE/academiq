import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
import { nextCookies } from 'better-auth/next-js';
import { emailOTP } from 'better-auth/plugins';
import resend from './resend';
import { APP_NAME } from './constants';
import EmailVerification from '@/emails/EmailVerification';

const domain = process.env.RESEND_DOMAIN;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: true,
  },

  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    expiresIn: 900, // 15 minutes
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
            react: EmailVerification({
              verficationCode: otp,
            }),
          });
        }
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
