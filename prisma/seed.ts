import { prisma } from '@/lib/prisma';
import { coursesSample } from '@/sampleData';

const seed = async () => {
  // await prisma.course.deleteMany();
  // await prisma.course.createMany({
  //   data: coursesSample,
  // });
};

seed();
