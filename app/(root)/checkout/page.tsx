import CheckoutDetails from '@/app/components/checkout/CheckoutDetails';
import { getMyCart } from '@/lib/actions/cart';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const CheckoutPage = async () => {
  const cart = await getMyCart();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!cart || cart.cartItems.length === 0)
    redirect('/login?callbackUrl=/checkout');

  return <CheckoutDetails cart={cart} />;
};

export default CheckoutPage;
