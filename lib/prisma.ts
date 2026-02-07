import { PrismaClient } from '@/lib/generated/prisma/client';
import { SocialLinks } from '@/types';
import { PrismaNeon } from '@prisma/adapter-neon';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    course: {
      price: {
        compute(data) {
          return data.price.toFixed(2);
        },
      },
    },

    order: {
      coursePrice: {
        compute(data) {
          return data.coursePrice.toFixed(2);
        },
      },

      totalPrice: {
        compute(data) {
          return data.totalPrice.toFixed(2);
        },
      },
      taxPrice: {
        compute(data) {
          return data.taxPrice.toFixed(2);
        },
      },
    },

    orderItem: {
      price: {
        compute(data) {
          return data.price.toFixed(2);
        },
      },
    },
    userProgress: {
      progress: {
        compute(data) {
          return data.progress.toString();
        },
      },
    },
    instructor: {
      socialLinks: {
        compute(data) {
          return data.socialLinks as SocialLinks;
        },
      },
    },
    review: {
      rating: {
        compute(data) {
          return Number(data.rating);
        },
      },
    },
  },
});
