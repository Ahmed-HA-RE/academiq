'use server';

import { CartItems } from '@/types';
import { cartItemsSchema, cartSchema } from '@/schema';
import { prisma } from '../prisma';
import { auth } from '../auth';
import { headers } from 'next/headers';
import { convertToPlainObject } from '../utils';
import { revalidatePath } from 'next/cache';
import { getCurrentLoggedUser } from './user';

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
    const user = await getCurrentLoggedUser();

    const validateData = cartItemsSchema.safeParse(data);

    const cart = await getMyCart();

    const { itemsPrice, taxPrice, totalPrice } = calculatePrices([data]);

    const course = await prisma.course.findFirst({
      where: { id: data.courseId },
      include: { instructor: true },
    });

    if (!course) throw new Error('Course not found');
    // Check if instructor that is adding the course is the same as course instructor

    if (course.instructor.userId === user?.id) {
      throw new Error('Instructors cannot add their own courses to the cart');
    }

    if (!validateData.success) throw new Error('Invalid data');

    if (!cart) {
      const newCart = cartSchema.safeParse({
        cartItems: [validateData.data],
        itemsPrice,
        taxPrice,
        totalPrice,
        userId: user?.id,
      });

      if (newCart.success) {
        await prisma.cart.create({
          data: {
            itemsPrice: newCart.data.itemsPrice,
            taxPrice: newCart.data.taxPrice,
            totalPrice: newCart.data.totalPrice,
            userId: user?.id,
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

      const { itemsPrice, taxPrice } = calculatePrices(
        cart.cartItems as CartItems[]
      );

      let totalPrice = Number(itemsPrice) + Number(taxPrice);
      // if there is discount and there are items in cart recalculate total price with discount
      if (cart && cart.discount && cart.cartItems.length > 0) {
        if (cart.discount.type === 'fixed') {
          const newTotalPrice = Number(totalPrice) - cart.discount.amount;
          totalPrice = newTotalPrice;
        } else if (cart.discount.type === 'percentage') {
          const discountAmount =
            (Number(totalPrice) * cart.discount.amount) / 100;
          const newTotalPrice = Number(totalPrice) - discountAmount;
          totalPrice = newTotalPrice;
        }
      }

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

  const cart = await prisma.cart.findFirst({
    where: {
      OR: [
        {
          userId: session?.user.id,
        },
      ],
    },
    include: { discount: true },
  });

  if (!cart) return undefined;

  if (cart.cartItems.length === 0) {
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        discountId: null,
      },
    });
  }

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

    const { itemsPrice, taxPrice } = calculatePrices(updatedCart);
    let totalPrice = Number(itemsPrice) + Number(taxPrice);

    // if there is discount and there are items in cart recalculate total price with discount
    if (cart.discount && updatedCart.length > 0) {
      if (cart.discount.type === 'fixed') {
        const newTotalPrice = Number(totalPrice) - cart.discount.amount;
        totalPrice = newTotalPrice;
      } else if (cart.discount.type === 'percentage') {
        const discountAmount =
          (Number(totalPrice) * cart.discount.amount) / 100;
        const newTotalPrice = Number(totalPrice) - discountAmount;
        totalPrice = newTotalPrice;
      }
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        itemsPrice,
        taxPrice,
        totalPrice: totalPrice < 0 ? 0 : totalPrice.toFixed(2),
        cartItems: updatedCart as CartItems[],
      },
    });
    revalidatePath('/', 'layout');
    return { success: true, message: 'Course removed from cart' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
