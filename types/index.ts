import {
  baseCourseSchema,
  cartItemsSchema,
  cartSchema,
  forgotPasswordSchema,
  instructorSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyOTPSchema,
} from '@/schema';
import z from 'zod';

export type Course = z.infer<typeof baseCourseSchema> & {
  id: string;
  // instructorId: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
  updatedAt: Date;
  totalPages?: number;
};

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type VerifyOTPFormData = z.infer<typeof verifyOTPSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type CartItems = z.infer<typeof cartItemsSchema>;
export type Cart = z.infer<typeof cartSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  cartItems: CartItems[];
};
export type Instructor = z.infer<typeof instructorSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
