import CartDetails from '@/app/components/CartDetails';
import { cleanUpCart, getMyCart } from '@/lib/actions/cart';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getDiscountById } from '@/lib/actions/discount';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Review the items in your cart and proceed to checkout.',
};

const CartPage = async () => {
  // Clear any enrolled courses from the cart
  await cleanUpCart();

  const cart = await getMyCart();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let discount;

  if (cart?.discountId) {
    discount = await getDiscountById(cart.discountId);
  }

  return <CartDetails cart={cart} session={session} discount={discount} />;
};

export default CartPage;
