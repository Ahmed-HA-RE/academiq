import parsePhoneNumberFromString, { CountryCode } from 'libphonenumber-js';
import z from 'zod';
import { validCountryPhones } from '@/lib/constants';
import { isAfter } from 'date-fns';

// Decimal validation for courses
const positiveMoney = z
  .string()
  .regex(/^(0|[1-9]\d*)\.\d{2}$/, {
    error: 'Must be a number with exactly 2 decimal places',
  })
  .refine((val) => parseFloat(val) > 0, {
    error: 'Money amount must be greater than 0',
  });

// Decimal validation for orders and cart (can be zero)
const moneyAmount = z
  .string()
  .regex(/^(0|[1-9]\d*)\.\d{2}$/, {
    error: 'Must be a number with exactly 2 decimal places',
  })
  .refine((val) => parseFloat(val) >= 0, {
    error: 'Money amount must be greater than or equal to 0',
  });

// File validation
const fileSchema = z
  .file({ error: 'File is required' })
  .max(8_000_000, { error: 'Max file size is 8MB' })
  .mime(['application/pdf'], { error: 'Only PDF file format is allowed' });

const avatarSchema = z
  .file({ error: 'Avatar is required' })
  .max(5_000_000, { error: 'Max file size is 5MB' })
  .mime(['image/jpeg', 'image/png'], {
    error: 'Only JPG/PNG file formats are allowed',
  })
  .optional();

// Phone number validation for orders and instructors
const phoneSchema = z.string().refine(
  (val) => {
    const phone = parsePhoneNumberFromString(val);
    if (phone?.isValid()) return true;
  },
  {
    error: 'Invalid phone number',
  }
);

// Optional phone number validation (for admin updating users)
const adminForUsersPhoneSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val) return true; // Optional field
      for (const country of validCountryPhones) {
        const phone = parsePhoneNumberFromString(val, country as CountryCode);
        if (phone?.isValid()) return true;
      }
    },
    {
      error: 'Invalid phone number',
    }
  );

// Courses schema
export const baseCourseSchema = z.object({
  slug: z.string({ error: 'Invalid slug' }).min(1, 'Slug is required'),
  title: z.string({ error: 'Invalid title' }).min(1, 'Title is required'),
  description: z
    .string({ error: 'Invalid description' })
    .min(5, 'Course description is required')
    .max(100, 'Course description is too long'),
  price: positiveMoney,
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

export const discountSchema = z
  .object({
    code: z
      .string({ error: 'Invalid discount code' })
      .min(1, 'Discount code is required'),
    type: z.enum(['percentage', 'fixed'], { error: 'Invalid discount type' }),
    amount: z.coerce
      .number<number>()
      .min(1, 'Discount amount must be at least 1'),
    validUntil: z.date().refine((val) => isAfter(val, new Date()), {
      error: 'Must be a future date',
    }),
  })
  .refine(
    (data) =>
      (data.type === 'percentage' && data.amount <= 100) ||
      data.type === 'fixed',
    {
      error: 'Percentage discount cannot exceed 100',
      path: ['amount'],
    }
  );

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
  price: positiveMoney,
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
  itemsPrice: positiveMoney,
  taxPrice: positiveMoney,
  totalPrice: moneyAmount,
});

export const instructorSchema = z.object({
  bio: z
    .string({ error: 'Invalid bio' })
    .min(1, 'Bio is required')
    .max(500, 'Bio is too long'),
  socialLinks: z
    .object({
      whatsapp: phoneSchema,
      instagram: z
        .string({ error: 'Invalid instagram username' })
        .min(3, 'Instagram username is required'),
      linkedin: z
        .string({ error: 'Invalid LinkedIn username' })
        .min(3, 'LinkedIn username is required'),
    })
    .partial(),
  expertise: z
    .array(z.string({ error: 'Invalid expertise' }))
    .min(1, 'At least one expertise is required'),
  address: z.string({ error: 'Invalid address' }).min(5, 'Address is required'),
  phone: phoneSchema,
  birthDate: z
    .date({ error: ' Invalid birth date' })
    .min(new Date('1940-01-01'), 'Too old!')
    .max(new Date('2006-01-01'), 'Too young!'),
  userId: z.string({ error: 'Invalid user id' }).min(1, 'User id is required'),
});

export const billingInfoSchema = z.object({
  fullName: z
    .string({ error: 'Invalid full name' })
    .min(3, 'Full name is required'),
  email: z.email({ error: 'Invalid email address' }),
  phone: phoneSchema,
  address: z
    .string({ error: 'Invalid address' })
    .min(10, 'Address field should be at least 10 characters long'),
  city: z.string({ error: 'Invalid city' }).min(5, 'City is required'),
});

export const orderBaseSchema = z.object({
  userId: z.string({ error: 'Invalid user id' }).min(1, 'User id is required'),
  itemsPrice: positiveMoney,
  taxPrice: positiveMoney,
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
    bio: true,
    expertise: true,
    address: true,
    phone: true,
    birthDate: true,
    socialLinks: true,
  })
  .extend({
    file: fileSchema,
    userId: z
      .string({ error: 'Invalid user id' })
      .min(1, 'User id is required'),
  });

export const updateUserAsAdminSchema = z.object({
  name: z
    .string({ error: 'Invalid name' })
    .min(3, 'Name is required')
    .max(50, 'Name is too long'),
  email: z.email({ error: 'Invalid email address' }),
  role: z.string({ error: 'Invalid role' }).min(1, 'Role is required'),
  status: z.string({ error: 'Invalid status' }).min(1, 'Status is required'),
  phone: adminForUsersPhoneSchema,
  address: z.string({ error: 'Invalid address' }).refine(
    (val) => {
      if (!val) return true;
      return val.length >= 10;
    },
    { error: 'Address field should be at least 10 characters long' }
  ),

  city: z.string({ error: 'Invalid city' }).optional(),
  fullName: z.string({ error: 'Invalid full name' }).refine(
    (val) => {
      if (!val) return true;
      return val.length >= 3;
    },
    { error: 'Full name field should be at least 3 characters long' }
  ),
  avatar: avatarSchema,
});
