'use server';

import { CartItems } from '@/types';
import { cartItemsSchema, cartSchema } from '@/schema';
import { prisma } from '../prisma';
import { auth } from '../auth';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';
import { convertToPlainObject } from '../utils';
import { discountSchema } from '@/schema';
import { Discount } from '@/types';
import { revalidatePath } from 'next/cache';

const calculatePrices = (cartItems: CartItems[]) => {
  const itemsPrice = cartItems.reduce((acc, c) => acc + Number(c.price), 0);
  const taxPrice = itemsPrice * 0.05; // 5% tax rate
  const totalPrice = itemsPrice + taxPrice;

  return {
    itemsPrice: itemsPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export const addToCart = async (data: CartItems) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const validateData = cartItemsSchema.safeParse(data);

    const sessionId = (await cookies()).get('sessionId')?.value;
    const cart = await getMyCart();

    const { itemsPrice, taxPrice, totalPrice } = calculatePrices([data]);

    const course = await prisma.course.findFirst({
      where: { id: data.courseId },
    });

    if (!course) throw new Error('Course not found');

    if (!validateData.success) throw new Error('Invalid data');

    if (!cart) {
      const newCart = cartSchema.safeParse({
        cartItems: [validateData.data],
        itemsPrice,
        taxPrice,
        totalPrice,
        userId: session?.user.id,
        sessionId: sessionId,
      });

      if (newCart.success) {
        await prisma.cart.create({
          data: {
            itemsPrice: newCart.data.itemsPrice,
            taxPrice: newCart.data.taxPrice,
            totalPrice: newCart.data.totalPrice,
            userId: session?.user.id,
            sessionId: newCart.data.sessionId,
            cartItems: newCart.data.cartItems,
          },
        });

        revalidatePath('/', 'layout');
      }
    } else {
      // check if course already in cart
      const existingCourse = (cart.cartItems as CartItems[]).find(
        (item) => item.courseId === validateData.data.courseId
      );

      if (existingCourse) throw new Error('Course already in cart');

      cart.cartItems.push(validateData.data);

      const { itemsPrice, taxPrice, totalPrice } = calculatePrices(
        cart.cartItems as CartItems[]
      );

      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          itemsPrice,
          taxPrice,
          totalPrice,
          cartItems: cart.cartItems as CartItems[],
        },
      });
    }
    revalidatePath('/', 'layout');
    return { success: true, message: 'Course added to cart' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const getMyCart = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const sessionId = (await cookies()).get('sessionId')?.value;

  console.log(sessionId);

  const cart = await prisma.cart.findFirst({
    where: {
      OR: [
        {
          userId: session?.user.id,
        },
        { sessionId: sessionId || undefined },
      ],
    },
  });

  if (!cart) return undefined;

  return convertToPlainObject({
    ...cart,
    cartItems: cart.cartItems as CartItems[],
  });
};

export const removeFromCart = async (courseId: string) => {
  try {
    const course = await prisma.course.findFirst({
      where: { id: courseId },
    });

    if (!course) throw new Error('Course not found');

    const cart = await getMyCart();

    if (!cart) throw new Error('No cart found');

    const updatedCart = (cart.cartItems as CartItems[]).filter(
      (item) => item.courseId !== courseId
    );

    const { itemsPrice, taxPrice, totalPrice } = calculatePrices(updatedCart);

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        itemsPrice,
        taxPrice,
        totalPrice,
        cartItems: updatedCart as CartItems[],
      },
    });
    revalidatePath('/', 'layout');
    return { success: true, message: 'Course removed from cart' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const applyDiscountToCart = async (code: string) => {
  try {
    const currentTime = new Date();

    const validateCode = discountSchema.safeParse(code);

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
      const newTotalPrice = Number(cart.totalPrice) - discount.amount;

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
