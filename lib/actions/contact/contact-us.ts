'use server';

import { ContactFormData } from '@/types';
import resend, { domain } from '@/lib/resend';
import { contactUsSchema } from '@/schema';
import { APP_NAME } from '@/lib/constants';
import ratelimit from '@/lib/redis';
import { headers } from 'next/headers';

export const contactUs = async (data: ContactFormData) => {
  try {
    const validatedData = contactUsSchema.safeParse(data);

    if (!validatedData.success) throw new Error('Invalid data');

    const headersList = await headers();

    const ip = headersList.get('x-forwarded-for');

    const identifier = ip!;
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      throw new Error('Too many requests. Please try again later.');
    }

    await resend.emails.send({
      from: `${APP_NAME} <contact@${domain}>`,
      to: process.env.EMAIL_SENDER!, // for testing purposes
      replyTo: validatedData.data.email,
      subject: `New Message from ${validatedData.data.name} via Contact Us Form`,
      text: `Message From: ${validatedData.data.name} <${validatedData.data.email}>\nTitle: ${validatedData.data.title}\n\nMessage:\n${validatedData.data.message}`,
    });

    return { success: true, message: 'Message sent successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
