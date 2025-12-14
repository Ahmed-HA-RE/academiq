import { prisma } from '@/lib/prisma';
import { coursesSample, sampleDiscounts } from '@/sampleData';

const seed = async () => {
  await prisma.course.deleteMany();
  await prisma.discount.deleteMany();

  await prisma.course.createMany({
    data: coursesSample,
  });

  await prisma.discount.createMany({
    data: sampleDiscounts,
  });
};

seed();
