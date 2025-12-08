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
