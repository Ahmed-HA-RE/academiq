import CartDetails from '@/app/components/CartDetails';
import { getMyCart } from '@/lib/actions/cart';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const CartPage = async () => {
  const cart = await getMyCart();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <CartDetails cart={cart} session={session} />;
};

export default CartPage;
