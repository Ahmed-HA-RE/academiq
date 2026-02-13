'use server';

import type { LoginFormData, RegisterFormData } from '@/types';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  verifyOTPSchema,
} from '@/schema';
import { auth } from '../auth';
import { headers } from 'next/headers';
import { APIError } from 'better-auth';
import { SERVER_URL } from '../constants';
import { cookies } from 'next/headers';
import { getCurrentLoggedUser } from './getUser';
import { prisma } from '../prisma';

export const registerUser = async (data: RegisterFormData) => {
  try {
    const validatedData = registerSchema.safeParse(data);

    if (!validatedData.success) throw new Error('Invalid form data');

    const { name, email, password } = validatedData.data;

    await auth.api.signUpEmail({
      body: {
        name: name.trim(),
        email,
        password,
      },
      headers: await headers(),
    });

    return {
      success: true,
      message:
        'Registered successfully Please check your email to verify your account.',
    };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const loginUser = async (data: LoginFormData) => {
  try {
    const validatedData = loginSchema.safeParse(data);

    if (!validatedData.success) throw new Error('Invalid form data');

    const { email, password, rememberMe } = validatedData.data;

    await auth.api.signInEmail({
      body: {
        email,
        password,
        rememberMe,
      },
      headers: await headers(),
    });

    return { success: true, message: 'Logged in successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const logoutUser = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) throw new Error('No active user found');

    await auth.api.signOut({
      headers: await headers(),
    });

    // Clear sessionId cookie
    (await cookies()).delete('sessionId');

    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const sendEmailVerificationOTP = async (email: string) => {
  try {
    if (!email) throw new Error('Email is required');

    await auth.api.sendVerificationOTP({
      body: {
        type: 'sign-in',
        email,
      },
    });

    return { success: true, message: 'Verification code sent successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const verifyEmail = async (otp: string, email: string) => {
  try {
    if (!email) throw new Error('Email is required');

    const validatedData = verifyOTPSchema.safeParse({ code: otp });

    if (!validatedData.success) throw new Error('Invalid OTP code');

    await auth.api.signInEmailOTP({
      body: {
        email,
        otp,
      },
    });
    return { success: true, message: 'Email verified successfully' };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        message: 'OTP has expired or is invalid. Please request a new one.',
      };
    }
    return { success: false, message: (error as Error).message };
  }
};

export const sendPasswordResetLink = async (email: string) => {
  try {
    const validatedData = forgotPasswordSchema.safeParse({ email });

    if (!validatedData.success) throw new Error('Invalid email address');

    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: `${SERVER_URL}/reset-password`,
      },
    });

    return { success: true, message: 'Password reset link sent successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const signInWithProviders = async (
  provider: 'google' | 'github',
  callbackURL: string,
) => {
  const result = await auth.api.signInSocial({
    body: {
      provider: provider,
      errorCallbackURL: `${SERVER_URL}`,
      callbackURL: callbackURL,
    },
  });
  if (result.url) {
    return { success: true, url: result.url };
  }
};

export const getUserProviderId = async () => {
  const user = await getCurrentLoggedUser();

  if (!user) return null;

  const provider = await prisma.account.findFirst({
    where: { userId: user.id },
    select: { providerId: true },
  });

  if (!provider) return null;

  return provider.providerId;
};
