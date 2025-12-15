import {
  baseCourseSchema,
  billingInfoSchema,
  cartItemsSchema,
  cartSchema,
  discountSchema,
  forgotPasswordSchema,
  instructorSchema,
  loginSchema,
  orderBaseSchema,
  orderItemSchema,
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

export type BillingInfo = z.infer<typeof billingInfoSchema>;
export type PaymentResult = {
  id: string;
  email: string;
  country: string;
  cardBrand: string;
  cardLast4: string;
  amount: number;
};

export type Discount = z.infer<typeof discountSchema>;

export type createOrderItems = z.infer<typeof orderItemSchema>;

export type OrderItems = z.infer<typeof orderItemSchema> & {
  id: string;
};

export type Order = z.infer<typeof orderBaseSchema> & {
  id: string;
  paymentResult: PaymentResult | null;
  isPaid: boolean;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  orderItems: OrderItems[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  role: string;
  billingInfo: BillingInfo | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};
