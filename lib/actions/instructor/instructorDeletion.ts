'use server';
import { auth } from '../../auth';
import { headers } from 'next/headers';
import { prisma } from '../../prisma';
import { revalidatePath } from 'next/cache';

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
