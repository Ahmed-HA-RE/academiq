import CheckoutDetails from '@/app/components/checkout/CheckoutDetails';
import { getCurrentLoggedUser } from '@/lib/actions/user';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getClientSecret } from '@/lib/actions/stripe.action';
import { getOrderById } from '@/lib/actions/order';

export const metadata: Metadata = {
  title: 'Checkout',
  description:
    'Complete your purchase securely and access your selected courses instantly.',
};

const CheckoutPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  if (!id) redirect('/cart');

  const [order, userInfo] = await Promise.all([
    getOrderById(id),
    getCurrentLoggedUser(),
  ]);

  if (!order || !userInfo) redirect('/');

  const clientSecret = await getClientSecret(order.stripePaymentIntentId);

  return (
    <CheckoutDetails
      user={userInfo}
      clientSecret={clientSecret}
      order={order}
    />
  );
};

export default CheckoutPage;
