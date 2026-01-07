import { prisma } from '@/lib/prisma';
import { getCurrentLoggedInInstructor } from '.';
import { convertToPlainObject } from '@/lib/utils';

export const getAllInstructorCertificates = async () => {
  const instructor = await getCurrentLoggedInInstructor();

  const certificates = await prisma.certifacte.findMany({
    where: {
      course: {
        instructorId: instructor.id,
      },
    },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      course: { select: { id: true, title: true } },
    },
  });

  return convertToPlainObject(certificates);
};
