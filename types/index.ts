import { baseCourseSchema } from '@/schema';
import z from 'zod';

export type Course = z.infer<typeof baseCourseSchema> & {
  id: string;
  rating: number;
  numReviews: number;
  createdAt: Date;
  updatedAt: Date;
};
