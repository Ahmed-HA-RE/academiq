import { CITY_OPTIONS } from '@/lib/utils';
import z from 'zod';

// Decimal validation
const moneyAmount = z
  .string()
  .regex(/^(0|[1-9]\d*)\.\d{2}$/, {
    message: 'Must be a number with exactly 2 decimal places',
  })
  .refine((val) => parseFloat(val) > 0, {
    message: 'Money amount must be greater than 0',
  });

const fileSchema = z
  .file({ error: 'File is required' })
  .max(8_000_000, { error: 'Max file size is 8MB' })
  .mime(['application/pdf'], { error: 'Only PDF file format is allowed' });

// Courses schema
export const baseCourseSchema = z.object({
  slug: z.string({ error: 'Invalid slug' }).min(1, 'Slug is required'),
  title: z.string({ error: 'Invalid title' }).min(1, 'Title is required'),
  description: z
    .string({ error: 'Invalid description' })
    .min(5, 'Course description is required')
    .max(100, 'Course description is too long'),
  price: moneyAmount,
  isFeatured: z.boolean().default(false),
  image: z
    .string({ error: 'Invalid image URL' })
    .min(1, 'Image URL is required'),
  language: z
    .string({ error: 'Invalid language' })
    .min(1, 'Language is required'),
  duration: z
    .number({ error: 'Invalid duration' })
    .min(1, 'Duration is required'),
  difficulty: z
    .string({ error: 'Invalid difficulty' })
    .min(1, 'Difficulty is required'),
  prequisites: z
    .string({ error: 'Invalid prequisites' })
    .min(1, 'Prequisites is required'),
});

// Auth schemas
export const registerSchema = z
  .object({
    name: z
      .string({ error: 'Invalid name' })
      .min(3, 'Name is required')
      .max(50, 'Name is too long'),
    email: z.email({ error: 'Invalid email address' }),
    password: z
      .string({ error: 'Invalid password' })
      .min(6, 'Password must be at least 6 characters long')
      .max(100, 'Password is too long'),
    confirmPassword: z
      .string({ error: 'Invalid confirm password' })
      .min(6, 'Confirm Password must be at least 6 characters long')
      .max(100, 'Confirm Password is too long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    error: "Passwords don't match",
  });

export const loginSchema = z.object({
  email: registerSchema.shape.email,
  password: registerSchema.shape.password,
  rememberMe: z.boolean(),
});

export const verifyOTPSchema = z.object({
  code: z.string({ error: 'Invalid code' }).length(6, 'Code must be 6 digits'),
});

export const forgotPasswordSchema = registerSchema.pick({ email: true });

export const resetPasswordSchema = z
  .object({
    newPassword: registerSchema.shape.password,
    confirmPassword: registerSchema.shape.confirmPassword,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    error: "Passwords don't match",
  });

export const discountSchema = z.object({
  code: z
    .string({ error: 'Invalid discount code' })
    .min(1, 'Discount code is required'),
  type: z.string({ error: 'Invalid discount type' }),
  amount: z.coerce
    .number<number>()
    .min(1, 'Discount amount must be at least 1'),
  validUntil: z
    .date({ error: 'Invalid valid until date' })
    .min(new Date(), 'Validation date must be in the future'),
});

export const applyDiscountSchema = z.object({
  code: discountSchema.shape.code,
});

// Cart schema
export const cartItemsSchema = z.object({
  courseId: z
    .uuid({ error: 'Invalid course id' })
    .min(1, 'Course id is required'),
  slug: z
    .string({ error: 'Invalid course slug' })
    .min(1, 'Course slug is required'),
  name: z
    .string({ error: 'Invalid course name' })
    .min(1, 'Course name is required'),
  image: z
    .string({ error: 'Invalid course image' })
    .min(1, 'Course image is required'),
  price: moneyAmount,
});

export const cartSchema = z.object({
  sessionId: z
    .uuid({ error: 'Invalid session id' })
    .min(1, 'Session id is required')
    .optional()
    .nullable(),
  userId: z.string({ error: 'Invalid user id' }).optional().nullable(),
  discountId: z.string({ error: 'Invalid discount id' }).optional().nullable(),
  cartItems: z.array(cartItemsSchema).min(1, 'Cart items cannot be empty'),
  itemsPrice: moneyAmount,
  taxPrice: moneyAmount,
  totalPrice: moneyAmount,
});

export const instructorSchema = z.object({
  name: z.string({ error: 'Invalid name' }).min(3, 'Name is required'),
  bio: z
    .string({ error: 'Invalid bio' })
    .min(1, 'Bio is required')
    .max(500, 'Bio is too long'),
  expertise: z
    .array(
      z.string({ error: 'Invalid expertise' }),
      'Please seperate with commas'
    )
    .min(1, 'Expertise is required'),
  address: z.string({ error: 'Invalid address' }).min(5, 'Address is required'),
  avatar: z.string({ error: 'Invalid avatar' }).min(1, 'Avatar is required'),
  email: z.email({ error: 'Invalid email address' }),
  phone: z
    .string({ error: 'Invalid phone number' })
    .regex(/^(?:\+971|971|0)?[0-9]{9}$/, 'Invalid UAE phone number'),
  birthDate: z
    .date({ error: ' Invalid birth date' })
    .min(new Date('1940-01-01'), 'Too old!')
    .max(new Date('2006-01-01'), 'Too young!'),
  socialLinks: z
    .object({
      whatsapp: z.url({ error: 'Invalid WhatsApp URL' }),
      instagram: z.url({ error: 'Invalid Instagram URL' }),
      linkedin: z.url({ error: 'Invalid LinkedIn URL' }),
    })
    .partial(),
  coursesId: z
    .array(z.uuid({ error: 'Invalid course id' }))
    .min(1, 'At least one course id is required'),
});

export const billingInfoSchema = z.object({
  fullName: z
    .string({ error: 'Invalid full name' })
    .min(1, 'Full name is required'),
  email: z.email({ error: 'Invalid email address' }),
  phone: instructorSchema.shape.phone,
  address: z
    .string({ error: 'Invalid address' })
    .min(10, 'Address field should be at least 10 characters long'),
  city: z.enum(
    CITY_OPTIONS.map((option) => option.value),
    { error: 'City is required' }
  ),
});

export const orderBaseSchema = z.object({
  userId: z.string({ error: 'Invalid user id' }).min(1, 'User id is required'),
  itemsPrice: moneyAmount,
  taxPrice: moneyAmount,
  totalPrice: moneyAmount,
  billingDetails: billingInfoSchema,
  discountId: z.string().optional().nullable(),
});

export const orderItemSchema = z.object({
  name: z
    .string({ error: 'Invalid course name' })
    .min(1, 'Course name is required'),
  price: moneyAmount,
  image: z
    .string({ error: 'Invalid course image' })
    .min(1, 'Course image is required'),
  courseId: z
    .string({ error: 'Invalid course id' })
    .min(1, 'Course id is required'),
});

export const createApplicationSchema = instructorSchema
  .pick({
    name: true,
    bio: true,
    expertise: true,
    address: true,
    phone: true,
    birthDate: true,
    socialLinks: true,
    email: true,
  })
  .extend({
    file: fileSchema,
  });
