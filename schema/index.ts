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

// Courses schema
export const baseCourseSchema = z.object({
  slug: z.string({ error: 'Invalid slug' }).min(1, 'Slug is required'),
  title: z.string({ error: 'Invalid title' }).min(1, 'Title is required'),
  description: z
    .string({ error: 'Invalid description' })
    .min(5, 'Course description is required')
    .max(100, 'Course description is too long'),
  price: moneyAmount,
  salePrice: moneyAmount.optional().nullable(),
  isFeatured: z.boolean().default(false),
  image: z
    .string({ error: 'Invalid image URL' })
    .min(1, 'Image URL is required'),
  language: z
    .string({ error: 'Invalid language' })
    .min(1, 'Language is required'),
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

// Cart schema
export const cartItemsSchema = z.object({
  courseId: z
    .uuid({ error: 'Invalid course id' })
    .min(1, 'Course id is required'),
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
    .min(1, 'Session id is required'),
  userId: z.string({ error: 'Invalid user id' }).optional().nullable(),
  cartItems: z.array(cartItemsSchema).min(1, 'Cart items cannot be empty'),
  itemsPrice: moneyAmount,
  taxPrice: moneyAmount,
  totalPrice: moneyAmount,
});
