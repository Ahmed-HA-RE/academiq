import CartDetails from '@/app/components/CartDetails';
import { getMyCart } from '@/lib/actions/cart';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getDiscountById } from '@/lib/actions/discount';

const CartPage = async () => {
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
