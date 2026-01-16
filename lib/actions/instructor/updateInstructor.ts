'use server';

import { auth } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';
import { instructorUpdateSchema } from '@/schema';
import { InstructorFormData } from '@/types';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

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
