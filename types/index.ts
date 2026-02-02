import {
  baseCourseSchema,
  billingInfoSchema,
  cartItemsSchema,
  cartSchema,
  contactUsSchema,
  courseReviewSchema,
  createCourseSchema,
  discountSchema,
  forgotPasswordSchema,
  instructorCertificateSchema,
  instructorSchema,
  instructorUpdateSchema,
  loginSchema,
  orderBaseSchema,
  orderItemSchema,
  registerSchema,
  resetPasswordSchema,
  updateMyAccountDetailsSchema,
  updateUserAsAdminSchema,
  verifyOTPSchema,
} from '@/schema';
import z from 'zod';

export type Lesson = {
  id: string;
  title: string;
  duration: number;
  status: 'ready' | 'processing' | 'failed';
  sectionId: string;
  createdAt: Date;
  muxData: {
    muxAssetId: string;
    muxPlaybackId: string;
    uploadthingFileId: string;
  } | null;
  position: number;
};

export type Section = {
  id: string;
  title: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  lessons: Lesson[];
};

export type Course = z.infer<typeof baseCourseSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  totalPages?: number;
  instructor: Instructor;
};

export type CourseCardType = Omit<Course, 'sections'> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  instructor: Omit<Instructor, 'socialLinks'>;
};

export type CreateCourse = z.infer<typeof createCourseSchema>;
export type MyCoursesCardType = Course & {
  sections: Section[];
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
  user: Pick<User, 'name' | 'email' | 'image' | 'banned' | 'role' | 'id'>;
  stripeAccountId: string;
  coursesCount?: number;
  courses?: Course;
};

export type InstructorFormData = z.infer<typeof instructorUpdateSchema>;

export type BillingInfo = z.infer<typeof billingInfoSchema>;
export type PaymentResult = {
  id: string;
  currency: string;
  amount: string;
};

export type Discount = z.infer<typeof discountSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  stripeCouponId: string | null;
};
export type CreateDiscount = z.infer<typeof discountSchema>;

export type OrderItems = z.infer<typeof orderItemSchema> & {
  id: string;
  stripeTransferId?: string | null;
  payoutsEnabled: boolean;
};
export type createOrderItems = z.infer<typeof orderItemSchema>;

export type Order = z.infer<typeof orderBaseSchema> & {
  id: string;
  paymentResult: PaymentResult | null;
  isPaid: boolean;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  stripePaymentIntentId: string | null;
  discount: Discount | null;
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
  banned: boolean;
  createdAt: Date;
  updatedAt: Date;
  courses?: Pick<Course, 'id' | 'title' | 'image'>[];
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
  city: string;
};

export type SocialLinks = {
  whatsapp?: string;
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

export type EnrolledStudents = {
  studentName: string;
  studentEmail: string;
  studentImage: string;
  enrolledAt: Date;
  courseId: string;
  courseName: string;
  progress: string | number;
};

export type InstructorCertificate = z.infer<
  typeof instructorCertificateSchema
> & {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
  course: {
    id: string;
    title: string;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type Review = z.infer<typeof courseReviewSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  user: Pick<User, 'name' | 'image' | 'id'>;
};

export type CreateReview = z.infer<typeof courseReviewSchema>;

export type ContactFormData = z.infer<typeof contactUsSchema>;

export type UpdateMyAccount = z.infer<typeof updateMyAccountDetailsSchema>;
