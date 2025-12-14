import { notFound } from 'next/navigation';
import { auth } from '../auth';
import { headers } from 'next/headers';
import { prisma } from '../prisma';

export const getUserById = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    notFound();
  }

  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
  });

  if (!user) return notFound();

  return user;
};
