import CartDetails from '@/app/components/cart/CartDetails';
import { getMyCart } from '@/lib/actions/cart';
import { getDiscountById } from '@/lib/actions/discount';
import { getCurrentLoggedUser } from '@/lib/actions/user';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Review the items in your cart and proceed to checkout.',
};

const CartPage = async () => {
  const [cart, user] = await Promise.all([getMyCart(), getCurrentLoggedUser()]);

  let discount;

  if (cart?.discountId) {
    discount = await getDiscountById(cart.discountId);
  }

  if (!user) redirect('/login');

  return <CartDetails cart={cart} discount={discount} user={user} />;
};

export default CartPage;
