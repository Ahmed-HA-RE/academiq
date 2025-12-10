'use server';

import { CartItems } from '@/types';
import { cartItemsSchema } from '@/schema';
import { prisma } from '../prisma';
import { auth } from '../auth';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';
import { convertToPlainObject } from '../utils';
import { revalidatePath } from 'next/cache';

const calculatePrices = (cartItems: CartItems[]) => {
  const itemsPrice = cartItems.reduce((acc, c) => acc + Number(c.price), 0);
  const taxPrice = itemsPrice * 0.05; // 5% tax rate
  const totalPrice = itemsPrice + taxPrice;

  return {
    itemsPrice,
    taxPrice,
    totalPrice,
  };
};

export const addToCart = async (data: CartItems) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const validateData = cartItemsSchema.safeParse(data);

    const cart = await getMyCart();

    const sessionId = (await cookies()).get('sessionId')?.value;

    if (!sessionId) throw new Error('No session ID found');

    const { itemsPrice, taxPrice, totalPrice } = calculatePrices([data]);

    const course = await prisma.course.findFirst({
      where: { id: data.courseId },
    });

    if (!course) throw new Error('Course not found');

    if (!validateData.success) throw new Error('Invalid data');

    if (!cart) {
      await prisma.cart.create({
        data: {
          itemsPrice: itemsPrice.toFixed(2),
          taxPrice: taxPrice.toFixed(2),
          totalPrice: totalPrice.toFixed(2),
          userId: session?.user.id,
          sessionId: sessionId,
          cartItems: [validateData.data],
        },
      });
      revalidatePath('/', 'layout');
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
          itemsPrice: itemsPrice.toFixed(2),
          taxPrice: taxPrice.toFixed(2),
          totalPrice: totalPrice.toFixed(2),
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

  if (!sessionId) throw new Error('No session ID found');

  const cart = await prisma.cart.findFirst({
    where: {
      OR: [
        {
          userId: session?.user.id,
        },
        {
          sessionId: sessionId,
        },
      ],
    },
  });
  if (!cart) return null;

  return convertToPlainObject(cart);
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
        itemsPrice: itemsPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
        cartItems: updatedCart as CartItems[],
      },
    });
    revalidatePath('/', 'layout');
    return { success: true, message: 'Course removed from cart' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
