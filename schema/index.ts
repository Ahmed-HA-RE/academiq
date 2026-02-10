import parsePhoneNumberFromString from 'libphonenumber-js';
import z from 'zod';
import { isAfter } from 'date-fns';

// Decimal validation for courses
const positiveMoney = z
  .string({ error: 'Invalid money amount' })
  .regex(/^(0|[1-9]\d*)\.\d{2}$/, {
    error: 'Must be a number with exactly 2 decimal places',
  })
  .refine((val) => parseFloat(val) > 0, {
    error: 'Money amount must be greater than 0',
  });

// Decimal validation for orders (can be zero)
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

// Phone number validation for orders and billing info
const phoneSchema = z.string().refine(
  (val) => {
    const phone = parsePhoneNumberFromString(val);
    if (phone?.isValid()) return true;
  },
  {
    error: 'Invalid phone number',
  },
);

// Optional phone number validation
const optionalPhoneSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val) return true; // Optional field
      const phone = parsePhoneNumberFromString(val);
      if (phone?.isValid()) return true;
    },
    {
      error: 'Invalid phone number',
    },
  );

// Courses schema
export const baseCourseSchema = z.object({
  title: z.string({ error: 'Invalid title' }).min(1, 'Title is required'),
  shortDesc: z
    .string({ error: 'Invalid short description' })
    .min(10, 'Short description is required')
    .max(255, 'Short description is too long'),
  description: z
    .string({ error: 'Invalid description' })
    .min(5, 'Course description is required'),
  price: positiveMoney,
  image: z.string({ error: 'Invalid image' }).min(1, 'Image is required'),
  imageKey: z
    .string({ error: 'Invalid image key' })
    .min(1, 'Image key is required'),
  language: z
    .string({ error: 'Invalid language' })
    .min(1, 'Language is required'),
  difficulty: z
    .string({ error: 'Invalid difficulty' })
    .min(1, 'Difficulty is required'),
  prequisites: z
    .string({ error: 'Invalid prequisites' })
    .min(1, 'Prequisites is required'),
  instructorId: z.uuid({ error: 'Invalid instructor id' }),
  category: z
    .string({ error: 'Invalid category' })
    .min(1, 'Category is required'),
  published: z.boolean({ error: 'Please choose a publication status' }),
});

export const createCourseSchema = baseCourseSchema.extend({
  sections: z
    .array(
      z.object({
        id: z.string().optional(), // for existing sections during updates
        title: z
          .string({ error: 'Invalid section title' })
          .min(1, 'Section title is required'),
        position: z.coerce
          .number<number>({ error: 'Invalid lesson position' })
          .min(1, 'Lesson Position must be at least 1'),
        lessons: z
          .array(
            z.object({
              id: z.string().optional(), // for existing lessons during updates
              title: z
                .string({ error: 'Invalid lesson title' })
                .min(1, 'Lesson title is required'),
              duration: z.coerce
                .number<number>({ error: 'Invalid lesson duration' })
                .min(0.5, 'Lesson duration must be at least 30 seconds'),
              videoUrl: z.string().optional(),
              uploadthingFileId: z.string().optional(),
              position: z.coerce
                .number<number>({ error: 'Invalid lesson position' })
                .min(1, 'Lesson Position must be at least 1'),
            }),
          )
          .min(1, { error: 'At least one lesson is required' }),
      }),
    )
    .min(1, { error: 'At least one section is required' }),
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

export const forgotPasswordSchema = z.object({
  email: registerSchema.shape.email,
});

export const resetPasswordSchema = z
  .object({
    newPassword: registerSchema.shape.password,
    confirmPassword: registerSchema.shape.confirmPassword,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    error: "Passwords don't match",
  });

export const instructorSchema = z.object({
  bio: z.string({ error: 'Invalid bio' }).min(1, 'Bio is required'),
  socialLinks: z
    .object({
      whatsapp: phoneSchema,
      instagram: z.string({ error: 'Invalid instagram username' }),

      linkedin: z.string({ error: 'Invalid LinkedIn username' }),
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
  city: z.string({ error: 'Invalid city' }),
});

export const instructorUpdateSchema = instructorSchema
  .pick({
    bio: true,
    socialLinks: true,
    expertise: true,
    phone: true,
  })
  .extend({
    name: registerSchema.shape.name,
    email: registerSchema.shape.email,
    image: avatarSchema,
  });

export const orderBaseSchema = z.object({
  userId: z.string({ error: 'Invalid user id' }).min(1, 'User id is required'),
  coursePrice: positiveMoney,
  taxPrice: positiveMoney,
  totalPrice: moneyAmount,
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
    city: true,
  })
  .extend({
    file: fileSchema,
    userId: z
      .string({ error: 'Invalid user id' })
      .min(1, 'User id is required'),
    socialLinks: instructorSchema.shape.socialLinks,
  });

export const updateUserAsAdminSchema = z.object({
  name: registerSchema.shape.name,
  email: registerSchema.shape.email,
  role: z.string({ error: 'Invalid role' }).min(1, 'Role is required'),
  status: z.string({ error: 'Invalid status' }).min(1, 'Status is required'),
  phone: optionalPhoneSchema,
  address: z.string({ error: 'Invalid address' }).refine(
    (val) => {
      if (!val) return true;
      return val.length >= 10;
    },
    { error: 'Address field should be at least 10 characters long' },
  ),

  country: z.string({ error: 'Invalid country' }).optional(),
  fullName: z.string({ error: 'Invalid full name' }).refine(
    (val) => {
      if (!val) return true;
      return val.length >= 3;
    },
    { error: 'Full name field should be at least 3 characters long' },
  ),
  avatar: avatarSchema,
});

export const instructorCertificateSchema = z.object({
  userId: z.string({ error: 'Invalid user id' }).min(1, 'User id is required'),
  courseId: z
    .uuid({ error: 'Invalid course id' })
    .min(1, 'Course id is required'),
  published: z
    .boolean({ error: 'Please choose a publication status' })
    .default(false),
});

export const courseReviewSchema = z.object({
  rating: z.coerce
    .number<number>({ error: 'Invalid rating' })
    .min(0.5, 'Rating is required')
    .max(5, 'Rating cannot be more than 5'),
  comment: z
    .string({ error: 'Invalid comment' })
    .min(1, 'Comment is required')
    .max(1000, 'Comment cannot be more than 1000 characters'),
  approved: z
    .boolean({ error: 'Please tick the approval box' })
    .refine((data) => data === true, {
      error: 'You must approve before submitting review',
    }),
  userId: z.string({ error: 'Invalid user id' }).min(1, 'User id is required'),
  courseId: z
    .string({ error: 'Invalid course id' })
    .min(1, 'Course id is required'),
});

export const contactUsSchema = z.object({
  name: registerSchema.shape.name,
  email: registerSchema.shape.email,
  title: z
    .string({ error: 'Invalid title' })
    .min(1, 'Title is required')
    .max(100, 'Title is too long'),
  message: z
    .string({ error: 'Invalid message' })
    .min(10, 'Message is required')
    .max(5000, 'Message is too long'),
});

export const updateAccountDetailsSchema = z.object({
  name: registerSchema.shape.name,
  email: registerSchema.shape.email,
  image: baseCourseSchema.shape.image,
  imageKey: z.string({ error: 'Invalid image key' }).optional(),
  billingInfo: z.object({
    name: z.string({ error: 'Invalid name' }).optional(),
    address: z.string({ error: 'Invalid address' }).optional(),
    country: z.string({ error: 'Invalid country' }).optional(),
    email: z.string({ error: 'Invalid email' }).optional(),
    phone: optionalPhoneSchema,
  }),
});

export const updateAccountPasswordSchema = z
  .object({
    currentPassword: registerSchema.shape.password,
    newPassword: registerSchema.shape.password,
    confirmNewPassword: registerSchema.shape.confirmPassword,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Password dosen't must match",
    path: ['confirmNewPassword'],
  });
