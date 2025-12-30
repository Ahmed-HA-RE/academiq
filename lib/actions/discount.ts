'use server';

import { applyDiscountSchema, discountSchema } from '@/schema';
import { prisma } from '../prisma';
import { getMyCart } from './cart';
import { revalidatePath } from 'next/cache';
import { auth } from '../auth';
import { headers } from 'next/headers';
import { CreateDiscount } from '@/types';
import stripe from '../stripe';
import { Prisma } from '../generated/prisma';
import { endOfDay, startOfDay } from 'date-fns';

export const getDiscountById = async (id: string) => {
  const discount = await prisma.discount.findUnique({
    where: { id },
  });

  if (!discount) return undefined;

  return discount;
};

export const applyDiscount = async (code: string) => {
  try {
    const currentTime = new Date();

    const validateCode = applyDiscountSchema.safeParse({ code });

    if (!validateCode.success) throw new Error('Invalid discount code');

    const discount = await prisma.discount.findFirst({
      where: { code: validateCode.data.code },
    });

    if (
      !discount ||
      discount.validUntil < currentTime ||
      !discount.stripeCouponId
    )
      throw new Error('Discount code not found');

    const cart = await getMyCart();

    if (!cart) throw new Error('No cart found');

    if (cart.discountId === discount.id)
      throw new Error('Discount code already applied');

    if (discount.type === 'percentage') {
      const discountAmount = (Number(cart.totalPrice) * discount.amount) / 100;
      const newTotalPrice = Number(cart.totalPrice) - discountAmount;

      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          totalPrice: newTotalPrice.toFixed(2),
          discountId: discount.id,
        },
      });
    } else if (discount.type === 'fixed') {
      const newTotalPrice = Number(cart.totalPrice) - discount.amount;

      console.log(newTotalPrice);

      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          totalPrice: newTotalPrice,
          discountId: discount.id,
        },
      });
    }

    revalidatePath('/cart', 'page');
    revalidatePath('/checkout', 'page');
    return { success: true, message: 'Discount applied successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const getValidDiscount = async () => {
  const discount = await prisma.discount.findFirst({
    where: {
      validUntil: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!discount) return undefined;

  return discount;
};

// Get all discounts as admin
export const getAllDiscounts = async ({
  page = 1,
  limit,
  search,
  type,
  expiry,
}: {
  page?: number;
  limit: number;
  search?: string;
  type?: 'percentage' | 'fixed' | 'all';
  expiry?: string;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin')
    throw new Error('Unauthorized to access discounts');

  // Search Filter
  const searchFilter: Prisma.DiscountWhereInput = search
    ? {
        code: { contains: search, mode: 'insensitive' },
      }
    : {};

  // Type Filter
  const typeFilter: Prisma.DiscountWhereInput =
    type && type !== 'all'
      ? {
          type: type,
        }
      : {};

  // Expiry Filter
  const expiryFilter: Prisma.DiscountWhereInput = expiry
    ? {
        validUntil: {
          gte: startOfDay(expiry),
          lte: endOfDay(expiry),
        },
      }
    : {};

  const discounts = await prisma.discount.findMany({
    where: {
      ...searchFilter,
      ...typeFilter,
      ...expiryFilter,
    },
    take: limit,
    skip: (page - 1) * limit,
    orderBy: { createdAt: 'desc' },
  });

  const totalDiscounts = await prisma.discount.count({
    where: {
      ...searchFilter,
      ...typeFilter,
      ...expiryFilter,
    },
  });

  const totalPages = Math.ceil(totalDiscounts / limit);

  return { discounts, totalPages };
};

// Delete discount by id as admin
export const deleteDiscountById = async (id: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin')
      throw new Error('Unauthorized to delete discount');

    const discount = await prisma.discount.findUnique({
      where: { id },
    });

    if (!discount) throw new Error('Discount not found');

    await prisma.discount.delete({
      where: { id: discount.id },
    });

    await stripe.coupons.del(discount.stripeCouponId as string);

    revalidatePath('/admin-dashboard/discounts', 'page');

    return { success: true, message: 'Discount deleted successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

// Create discount as admin
export const createDiscount = async (data: CreateDiscount) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin')
      throw new Error('Unauthorized to create discount');

    const isDiscountExist = await prisma.discount.findFirst({
      where: { code: data.code },
    });

    if (isDiscountExist)
      throw new Error('Discount with this code already exists');

    const validateDiscountData = discountSchema.safeParse(data);

    if (!validateDiscountData.success) throw new Error('Invalid discount data');

    await prisma.$transaction(async (tx) => {
      const newDiscount = await tx.discount.create({
        data: {
          code: validateDiscountData.data.code,
          type: validateDiscountData.data.type,
          amount: validateDiscountData.data.amount,
          validUntil: validateDiscountData.data.validUntil,
        },
      });

      await stripe.coupons.create({
        duration: 'once',
        name: newDiscount.code,
        percent_off:
          newDiscount.type === 'percentage' ? newDiscount.amount : undefined,
        amount_off:
          newDiscount.type === 'fixed' ? newDiscount.amount * 100 : undefined,
        metadata: {
          discountId: newDiscount.id,
        },
        currency: 'aed',
        redeem_by: Math.floor(newDiscount.validUntil.getTime() / 1000),
      });
    });

    revalidatePath('/admin-dashboard/discounts', 'page');

    return { success: true, message: 'Discount created successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
