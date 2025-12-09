'use server';

import type { LoginFormData, RegisterFormData } from '@/types';
import { loginSchema, registerSchema } from '@/schema';
import { auth } from '../auth';
import { headers } from 'next/headers';
import { SERVER_URL } from '../constants';

export const registerUser = async (data: RegisterFormData) => {
  try {
    const validatedData = registerSchema.safeParse(data);

    if (!validatedData.success) throw new Error('Invalid form data');

    const { name, email, password } = validatedData.data;

    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        callbackURL: `${SERVER_URL}/verified`,
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

export const sendEmailVerificationOTP = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) throw new Error('No active user found');

    await auth.api.sendVerificationOTP({
      body: {
        type: 'email-verification',
        email: session.user.email,
      },
    });

    return { success: true, message: 'Verification code sent successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const verifyEmail = async (otp: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) throw new Error('No active user found');

    await auth.api.verifyEmailOTP({
      body: {
        email: session.user.email,
        otp,
      },
    });
    return { success: true, message: 'Email verified successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
