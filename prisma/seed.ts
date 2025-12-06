import { prisma } from '@/lib/prisma';
import { sampleData } from '@/sampleData';

const seed = async () => {
  await prisma.course.deleteMany();

  await prisma.course.createMany({
    data: sampleData,
  });
};

seed();
