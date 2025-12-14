'use server';

import { applyDiscountSchema } from '@/schema';
import { prisma } from '../prisma';
import { getMyCart } from './cart';
import { revalidatePath } from 'next/cache';

export const getDiscountById = async (id: string) => {
  const discount = await prisma.discount.findUnique({
    where: { id },
  });

  if (!discount) return undefined;

  return discount;
};

export const applyDiscountToCart = async (code: string) => {
  try {
    const currentTime = new Date();

    const validateCode = applyDiscountSchema.safeParse({ code });

    if (!validateCode.success) throw new Error('Invalid discount code');

    const discount = await prisma.discount.findFirst({
      where: { code: validateCode.data.code },
    });

    if (!discount || discount.validUntil < currentTime)
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
      const newTotalPrice = Number(cart.totalPrice) + discount.amount;

      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          totalPrice: newTotalPrice.toFixed(2),
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
