'use server';

import type { LoginFormData } from '@/types';
import { loginSchema } from '@/schema';
import { auth } from '../auth';
import { headers } from 'next/headers';

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
