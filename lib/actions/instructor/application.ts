'use server';

import { addDays, endOfDay, startOfDay } from 'date-fns';
import { redirect } from 'next/navigation';
import { APP_NAME } from '../../constants';
import { domain } from '../../resend';
import ApplicationStatus from '@/emails/ApplicationStatus';
import resend from '../../resend';
import ApplicationSubmitted from '@/emails/ApplicationSubmitted';
import z from 'zod';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { createApplicationSchema } from '@/schema';
import { prisma } from '@/lib/prisma';
import { SocialLinks } from '@/types';
import { Prisma } from '@/lib/generated/prisma';
import { convertToPlainObject } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { uploadToCloudinary } from '@/lib/cloudinary';

export const applyToTeach = async (
  data: z.infer<typeof createApplicationSchema>
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) throw new Error('Unauthorized');

    const validateData = createApplicationSchema.safeParse(data);
    if (!validateData.success) throw new Error('Invalid data');

    if (session.user.role === 'admin')
      throw new Error('Admins cannot apply to be instructors.');

    if (!session.user.emailVerified)
      throw new Error('Please verify your email before applying.');

    // Check if user already applied
    const existingApplication = await prisma.intructorApplication.findUnique({
      where: { userId: session.user.id },
    });

    if (existingApplication) throw new Error('You have already applied.');

    // Convert the PDF URL to a file and upload to cloudinary
    const result = await uploadToCloudinary(
      validateData.data.file,
      '/academiq/instructors-application-pdf',
      `application_${session.user.name}`
    );

    // Save application to the database
    const userApplication = await prisma.intructorApplication.create({
      data: {
        ...validateData.data,
        birthDate: addDays(validateData.data.birthDate, 1),
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
      replyTo: process.env.REPLY_EMAIL,
      subject: 'Instructor Application Submitted',
      react: ApplicationSubmitted({ name: userApplication.user.name }),
    });
    return { success: true, message: 'Application submitted successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const getApplicationByUserId = async (userId: string | undefined) => {
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

// Get total Instructor Applications count
export const getInstructorApplicationsCount = async () => {
  const count = await prisma.intructorApplication.count();
  return count;
};

// Get all applications
export const getAllInstructorApplications = async ({
  page = 1,
  limit = 10,
  search,
  submittedAt,
  status,
}: {
  page: number;
  limit?: number;
  search?: string;
  submittedAt?: string;
  status?: string;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin')
    throw new Error('Unauthorized to access this resource');

  // Search Filter
  const searchFilter: Prisma.IntructorApplicationWhereInput = search
    ? {
        OR: [
          { user: { name: { contains: search, mode: 'insensitive' } } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
        ],
      }
    : {};

  // Submitted At Filter
  const submittedAtFilter: Prisma.IntructorApplicationWhereInput = submittedAt
    ? {
        createdAt: {
          gte: startOfDay(submittedAt),
          lte: endOfDay(submittedAt),
        },
      }
    : {};

  // Status Filter
  const statusFilter: Prisma.IntructorApplicationWhereInput = status
    ? {
        status: status,
      }
    : {};

  const applications = await prisma.intructorApplication.findMany({
    include: { user: { select: { name: true, email: true, image: true } } },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
    where: {
      ...searchFilter,
      ...submittedAtFilter,
      ...statusFilter,
    },
  });

  const totalApplications = await prisma.intructorApplication.count({
    where: {
      ...searchFilter,
      ...submittedAtFilter,
      ...statusFilter,
    },
  });

  const totalPages = Math.ceil(totalApplications / limit);

  return {
    applications: applications.map((app) =>
      convertToPlainObject({
        ...app,
        socialLinks: app.socialLinks as SocialLinks,
        file: app.file,
      })
    ),
    totalPages,
  };
};

// Delete application by ID
export const deleteApplicationById = async (applicationId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin')
      throw new Error('Unauthorized to delete this resource');

    const application = await prisma.intructorApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) throw new Error('Application not found');

    await prisma.intructorApplication.delete({
      where: { id: applicationId },
    });
    revalidatePath('/admin-dashboard/applications');
    return { success: true, message: 'Application deleted successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

// Delete multiple applications by IDs
export const deleteApplicationsByIds = async (applicationIds: string[]) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin')
      throw new Error('Unauthorized to delete these resources');

    await prisma.intructorApplication.deleteMany({
      where: { id: { in: applicationIds } },
    });
    revalidatePath('/admin-dashboard/applications');
    return { success: true, message: 'Applications deleted successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

// Update application status by ID
export const updateApplicationStatusById = async (
  applicationId: string,
  status: string
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin')
      throw new Error('Unauthorized to update this application');

    const application = await prisma.intructorApplication.findUnique({
      where: { id: applicationId },
      include: { user: { select: { name: true, email: true } } },
    });
    if (!application) throw new Error('Application not found');
    if (application.status === status)
      throw new Error('Application has already been reviewed.');

    // Create a transaction to update application status and create instructor if approved
    await prisma.$transaction(async (tx) => {
      const updatedApplication = await tx.intructorApplication.update({
        where: { id: applicationId },
        data: { status: status === 'approved' ? 'approved' : 'rejected' },
      });

      if (updatedApplication.status === 'approved') {
        const newInstructor = await tx.instructor.create({
          data: {
            bio: updatedApplication.bio,
            expertise: updatedApplication.expertise,
            address: updatedApplication.address,
            phone: updatedApplication.phone,
            socialLinks: updatedApplication.socialLinks as SocialLinks,
            birthDate: updatedApplication.birthDate,
            userId: updatedApplication.userId,
          },
        });
        // Update the role of the user to 'instructor' if approved
        await tx.user.update({
          where: { id: newInstructor.userId },
          data: { role: 'instructor' },
        });
      }
    });

    await resend.emails.send({
      from: `${APP_NAME} <support@${domain}>`,
      to: application.user.email,
      replyTo: process.env.REPLY_EMAIL,
      subject: 'Application Status Updated',
      react: ApplicationStatus({
        name: application.user.name,
        status: status,
      }),
    });

    revalidatePath('/admin-dashboard/applications');
    return { success: true, message: `Application ${status} successfully` };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const getApplicationById = async (applicationId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin')
    throw new Error('Unauthorized to view the application');

  const application = await prisma.intructorApplication.findUnique({
    where: { id: applicationId },
    include: { user: { select: { name: true, email: true, image: true } } },
  });

  if (!application) redirect('/admin-dashboard/applications');

  return convertToPlainObject({
    ...application,
    socialLinks: application.socialLinks as SocialLinks,
  });
};
