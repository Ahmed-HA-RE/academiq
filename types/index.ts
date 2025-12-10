import {
  baseCourseSchema,
  cartItemsSchema,
  cartSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyOTPSchema,
} from '@/schema';
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
export type VerifyOTPFormData = z.infer<typeof verifyOTPSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type CartItem = z.infer<typeof cartItemsSchema>;
export type Cart = z.infer<typeof cartSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
