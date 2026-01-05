'use server';
import { auth } from '../../auth';
import { headers } from 'next/headers';
import { instructorUpdateSchema } from '@/schema';
import { uploadToCloudinary } from '../../cloudinary';
import { prisma } from '../../prisma';
import { InstructorFormData, SocialLinks } from '@/types';
import { convertToPlainObject } from '../../utils';
import { revalidatePath } from 'next/cache';
import { Prisma } from '../../generated/prisma';
import stripe from '@/lib/stripe';
import { SERVER_URL } from '@/lib/constants';
import { redirect } from 'next/navigation';
import { getApplicationByUserId } from './application';

// Get total Instructors count
export const getTotalInstructorsCount = async () => {
  const count = await prisma.user.count({
    where: { role: 'instructor' },
  });
  return count;
};

export const getAllInstructorsAsAdmin = async ({
  limit = 10,
  page = 1,
  search,
  status,
}: {
  limit?: number;
  page?: number;
  search?: string;
  status?: string;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin')
    throw new Error('Unauthorized to get instructors');

  // Search Filter
  const searchFilter: Prisma.InstructorWhereInput = search
    ? {
        AND: [
          {
            OR: [
              { user: { name: { contains: search, mode: 'insensitive' } } },
              { user: { email: { contains: search, mode: 'insensitive' } } },
            ],
          },
        ],
        user: { role: 'instructor' },
      }
    : { user: { role: 'instructor' } };

  // Status Filter
  const statusFilter: Prisma.InstructorWhereInput = status
    ? {
        user: {
          banned: status === 'banned' ? true : false,
        },
      }
    : { user: { role: 'instructor' } };

  const instructors = await prisma.instructor.findMany({
    where: {
      ...searchFilter,
      ...statusFilter,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
          banned: true,
          id: true,
          role: true,
        },
      },
      _count: { select: { courses: true } },
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const totalInstructors = await prisma.instructor.count({
    where: {
      ...searchFilter,
      ...statusFilter,
    },
  });

  const totalPages = Math.ceil(totalInstructors / limit);

  return {
    instructors: instructors.map((instructor) =>
      convertToPlainObject({
        ...instructor,
        socialLinks: instructor.socialLinks as SocialLinks,
        coursesCount: instructor._count.courses,
      })
    ),
    totalPages,
  };
};

// Delete instructor by ID
export const deleteInstructorById = async (instructorId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin')
      throw new Error('Unauthorized to delete this resource');

    const instructor = await prisma.instructor.findUnique({
      where: { id: instructorId },
    });

    if (!instructor) throw new Error('Instructor not found');

    await prisma.instructor.delete({
      where: { id: instructor.id },
    });
    revalidatePath('/admin-dashboard/instructors');
    return { success: true, message: 'Instructor deleted successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

// Delete multiple instructors by IDs
export const deleteInstructorsByIds = async (instructorIds: string[]) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin')
      throw new Error('Unauthorized to delete these resources');

    await prisma.instructor.deleteMany({
      where: { id: { in: instructorIds } },
    });
    revalidatePath('/admin-dashboard/instructors');
    return { success: true, message: 'Instructors deleted successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const getInstructorByIdAsAdmin = async (instructorId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin')
    throw new Error('Unauthorized to delete this resource');

  const instructor = await prisma.instructor.findUnique({
    where: { id: instructorId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
          banned: true,
          role: true,
          id: true,
        },
      },
    },
  });

  if (!instructor) throw new Error('Instructor not found');

  return convertToPlainObject({
    ...instructor,
    socialLinks: instructor.socialLinks as SocialLinks,
  });
};

// Get current logged in instructor
export const getCurrentLoggedInInstructor = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error('Unauthorized');

  const instructor = await prisma.instructor.findUnique({
    where: { userId: session.user.id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
          banned: true,
          id: true,
          role: true,
        },
      },
    },
  });

  if (!instructor) throw new Error('Instructor not found');

  return convertToPlainObject({
    ...instructor,
    socialLinks: instructor.socialLinks as SocialLinks,
  });
};

// Update instructor as an admin
export const updateInstructorAsAdmin = async ({
  data,
  id,
}: {
  data: InstructorFormData;
  id: string;
}) => {
  let imageUrl;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin')
      throw new Error('Unauthorized to update the instructor');

    const instructor = await prisma.instructor.findUnique({
      where: { id },
      include: { user: { select: { image: true } } },
    });

    if (!instructor) throw new Error('Instructor not found');

    const validatedData = instructorUpdateSchema.safeParse(data);

    if (!validatedData.success) throw new Error('Invalid data');

    if (validatedData.data.image) {
      imageUrl = await uploadToCloudinary(validatedData.data.image, 'avatars');
    }

    await prisma.instructor.update({
      where: { id },
      data: {
        bio: validatedData.data.bio,
        expertise: validatedData.data.expertise,
        phone: validatedData.data.phone,
        socialLinks: {
          linkedin: `https://www.linkedin.com/in/${validatedData.data.socialLinks?.linkedin}`,
          whatsapp: `https://wa.me/${validatedData.data.socialLinks?.whatsapp?.slice(1)}`,
          instagram: `https://www.instagram.com/${validatedData.data.socialLinks?.instagram}`,
        },
        user: {
          update: {
            name: validatedData.data.name,
            email: validatedData.data.email,
            image: imageUrl?.secure_url
              ? imageUrl.secure_url
              : instructor.user.image,
          },
        },
      },
    });

    revalidatePath('/admin-dashboard');

    return { success: true, message: 'Instructor updated successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

// Update instructor profile as instructor
export const updateInstructorAccount = async ({
  data,
}: {
  data: InstructorFormData;
}) => {
  let imageUrl;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'instructor')
      throw new Error('Unauthorized to update the instructor');

    const instructor = await prisma.instructor.findUnique({
      where: { userId: session.user.id },
      include: { user: { select: { image: true } } },
    });

    if (!instructor) throw new Error('Instructor not found');

    const validatedData = instructorUpdateSchema.safeParse(data);

    if (!validatedData.success) throw new Error('Invalid data');

    if (validatedData.data.image) {
      imageUrl = await uploadToCloudinary(validatedData.data.image, 'avatars');
    }
    await prisma.instructor.update({
      where: { userId: session.user.id },
      data: {
        bio: validatedData.data.bio,
        expertise: validatedData.data.expertise,
        phone: validatedData.data.phone,
        socialLinks: {
          linkedin: `https://www.linkedin.com/in/${validatedData.data.socialLinks?.linkedin}`,
          whatsapp: `https://wa.me/${validatedData.data.socialLinks?.whatsapp?.slice(1)}`,
          instagram: `https://www.instagram.com/${validatedData.data.socialLinks?.instagram}`,
        },
        user: {
          update: {
            name: validatedData.data.name,
            email: validatedData.data.email,
            image: imageUrl?.secure_url
              ? imageUrl.secure_url
              : instructor.user.image,
          },
        },
      },
    });

    revalidatePath('/instructor-dashboard');

    return { success: true, message: 'Account updated successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

// Get stripe account by application
export const getStripeAccountByApplication = async () => {
  const application = await getApplicationByUserId();

  if (application) {
    const account = await stripe.accounts.retrieve(application.stripeAccountId);
    return convertToPlainObject(account);
  }
};

// Get instructor's stripe account
export const getInstructorStripeAccount = async () => {
  const instructor = await getCurrentLoggedInInstructor();

  const account = await stripe.accounts.retrieve(instructor.stripeAccountId);

  if (!account) redirect('/instructor-dashboard');

  return convertToPlainObject(account);
};

// Create Stripe onboarding link
export const createStripeOnboardingLink = async (stripeAccountId: string) => {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      return_url: `${SERVER_URL}/teach/apply/payments/setup`,
      refresh_url: `${SERVER_URL}/teach/apply/payments/setup`,
      type: 'account_onboarding',
    });

    return { success: true, redirect: accountLink.url, message: '' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
