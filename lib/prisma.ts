import { PrismaClient } from '@/lib/generated/prisma/client';
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
          return data.price.toString();
        },
      },
      rating: {
        compute(data) {
          return data.rating.toString();
        },
      },
      salePrice: {
        compute(data) {
          return data.salePrice?.toString();
        },
      },
    },
    cart: {
      itemsPrice: {
        compute(data) {
          return data.itemsPrice.toFixed(2);
        },
      },
      taxPrice: {
        compute(data) {
          return data.taxPrice.toFixed(2);
        },
      },
      totalPrice: {
        compute(data) {
          return data.totalPrice.toFixed(2);
        },
      },
    },
  },
});
