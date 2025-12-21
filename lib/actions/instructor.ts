'use server';

import { auth } from '../auth';
import { headers } from 'next/headers';
import { createApplicationSchema } from '@/schema';
import z from 'zod';
import cloudinary from '../cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { prisma } from '../prisma';
import { SocialLinks } from '@/types';
import resend from '../resend';
import ApplicationSubmitted from '@/emails/ApplicationSubmitted';
import { APP_NAME } from '../constants';

export const applyToTeach = async (
  data: z.infer<typeof createApplicationSchema>
) => {
  try {
    const domain = process.env.RESEND_DOMAIN;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) throw new Error('Unauthorized');

    const validateData = createApplicationSchema.safeParse(data);
    if (!validateData.success) throw new Error('Invalid data');

    // Check if user already applied
    const existingApplication = await prisma.intructorApplication.findUnique({
      where: { userId: session.user.id },
    });

    if (existingApplication) throw new Error('You have already applied.');

    // Convert the PDF URL to a buffer
    const arrayBuffer = await validateData.data.file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload the buffer to Cloudinary
    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: '/academiq/instructors-application-pdf',
            public_id: `application_${session.user.name}`,
            overwrite: true,
          },
          function (error, result) {
            if (error) {
              reject(error);
              return;
            }
            resolve(result as UploadApiResponse);
          }
        )
        .end(buffer);
    });

    // Save application to the database
    const userApplication = await prisma.intructorApplication.create({
      data: {
        ...validateData.data,
        userId: session.user.id,
        file: result.secure_url,
        socialLinks: {
          linkedin: `https://www.linkedin.com/in/${validateData.data.socialLinks?.linkedin}`,
          whatsapp: `https://wa.me/${validateData.data.socialLinks?.whatsapp?.slice(1)}`,
          instagram: `https://www.instagram.com/${validateData.data.socialLinks?.instagram}`,
        },
      },
      include: { user: { select: { name: true, email: true } } },
    });

    await resend.emails.send({
      from: `${APP_NAME} <support@${domain}>`,
      to: userApplication.user.email,
      subject: 'Instructor Application Submitted',
      react: ApplicationSubmitted({ name: userApplication.user.name }),
    });
    return { success: true, message: 'Application submitted successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const getApplicationByUserId = async (userId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error('Unauthorized');

  const application = await prisma.intructorApplication.findFirst({
    where: { userId },
  });

  if (!application) return undefined;

  return {
    ...application,
    socialLinks: application.socialLinks as SocialLinks,
  };
};
