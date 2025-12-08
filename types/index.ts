import { baseCourseSchema, loginSchema, registerSchema } from '@/schema';
import z from 'zod';

export type Course = z.infer<typeof baseCourseSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  isSaved: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
