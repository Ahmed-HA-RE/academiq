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
  updateUserAsAdminSchema,
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
  currentPrice: string;
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
  currency: string;
  country: string;
  amount: string;
  paymentIntentId: string;
};

export type Discount = z.infer<typeof discountSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  stripeCouponId: string | null;
};
export type CreateDiscount = z.infer<typeof discountSchema>;

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
  banned: boolean;
  createdAt: Date;
  updatedAt: Date;
  courses?: Pick<Course, 'id' | 'title' | 'slug' | 'image'>[];
};

export type InstructorApplication = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  phone: string;
  address: string;
  bio: string;
  socialLinks: {
    whatsapp?: string | undefined;
    instagram?: string | undefined;
    linkedin?: string | undefined;
  };
  expertise: string[];
  birthDate: Date;
  file: string;
  userId: string;
  user: {
    name: string;
    email: string;
    image: string;
  };
};

export type SocialLinks = {
  whaatsapp?: string;
  linkedin?: string;
  instagram?: string;
};

export type UserProgress = {
  id: string;
  userId: string;
  courseId: string;
  progress: string;
  updatedAt: Date;
};

export type UpdateUserAsAdmin = z.infer<typeof updateUserAsAdminSchema>;
