import CheckoutDetails from '@/app/components/CheckoutDetails';
import { getMyCart } from '@/lib/actions/cart';
import { getDiscountById } from '@/lib/actions/discount';
import { getCurrentLoggedUser } from '@/lib/actions/user';
import { SERVER_URL } from '@/lib/constants';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout',
  description:
    'Complete your purchase securely and access your selected courses instantly.',
};

const CheckoutPage = async () => {
  const [cart, userInfo] = await Promise.all([
    getMyCart(),
    getCurrentLoggedUser(),
  ]);

  let discount;
  if (cart?.discountId) {
    discount = await getDiscountById(cart.discountId);
  }

  if (!cart || cart.cartItems.length === 0)
    redirect(`/login?callbackUrl=${SERVER_URL}/checkout`);

  return <CheckoutDetails cart={cart} discount={discount} user={userInfo} />;
};

export default CheckoutPage;
