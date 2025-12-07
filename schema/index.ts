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
