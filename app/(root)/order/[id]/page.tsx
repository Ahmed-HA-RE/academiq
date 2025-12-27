import { CreditCardIcon, MailIcon, MapPinIcon, UserIcon } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';

import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { redirect } from 'next/navigation';
import { getOrderById } from '@/lib/actions/order';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';
import { Metadata } from 'next';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Order Summary',
  description: 'View the summary of your order',
};

const OrderSummaryPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const order = await getOrderById(id);

  if (
    !session ||
    !order ||
    (order.userId !== session.user.id && session.user.role !== 'admin')
  ) {
    redirect('/');
  }

  if (!order.isPaid && session.user.role !== 'admin') redirect('/');

  return (
    <section className='mb-14'>
      <div className='container'>
        <Card className='w-full'>
          <CardHeader className='flex flex-row justify-between items-center'>
            <CardTitle className='text-2xl'>Order Summary</CardTitle>
            <Badge
              className={cn(
                order.status === 'unpaid'
                  ? 'bg-destructive/10 text-destructive'
                  : order.status === 'paid'
                    ? 'bg-green-600/10 text-green-600'
                    : order.status === 'refunded'
                      ? 'bg-fuchsia-500/10 text-fuchsia-500'
                      : 'bg-amber-600/10 text-amber-600'
              )}
            >
              <span
                className={cn(
                  'size-1.5 rounded-full',
                  order.status === 'unpaid'
                    ? 'bg-destructive'
                    : order.status === 'paid'
                      ? 'bg-green-600'
                      : order.status === 'refunded'
                        ? 'bg-fuchsia-500'
                        : 'bg-amber-600'
                )}
              ></span>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </CardHeader>
          <CardContent className='grid gap-10 py-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
            <div className='space-y-8'>
              <h5 className='text-lg font-semibold'>Billing Details</h5>
              <div className='space-y-2.5'>
                <div className='flex items-center gap-2.5'>
                  <MailIcon className='size-5' />
                  <span className='font-medium'>Email Address</span>
                </div>
                <span className='text-muted-foreground'>
                  {order.billingDetails.email}
                </span>
              </div>
              <div className='space-y-2.5'>
                <div className='flex items-center gap-2.5'>
                  <MapPinIcon className='size-5' />
                  <span className='font-medium'>Shipping Address</span>
                </div>
                <span className='text-muted-foreground'>
                  {order.billingDetails.address}
                </span>
              </div>
              <div className='space-y-2.5'>
                <div className='flex items-center gap-2.5'>
                  <UserIcon className='size-5' />
                  <span className='font-medium'>Name</span>
                </div>
                <span className='text-muted-foreground'>
                  {order.billingDetails.fullName}
                </span>
              </div>
            </div>

            <div className='space-y-6'>
              <h5 className='text-lg font-semibold'>Payment Method</h5>
              <div className='space-y-2.5'>
                <div className='flex items-center gap-2.5'>
                  <CreditCardIcon className='size-5' />
                  <span className='font-medium'>Payment</span>
                </div>
                <span className='text-muted-foreground'>Credit Card</span>
              </div>
            </div>

            <div className='space-y-6 sm:col-span-2'>
              <h5 className='text-lg font-semibold'>
                {order.status === 'refunded' ? 'Refunded' : 'Purchased'} Courses
              </h5>
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className='flex items-center justify-between gap-3.5'
                >
                  <div className='flex items-center gap-6'>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={86}
                      height={86}
                      className='rounded-md'
                    />
                    <h4 className='font-medium'>{item.name}</h4>
                  </div>
                  <span className='text-lg font-semibold'>
                    <div className='flex flex-row items-center gap-1 font-semibold'>
                      <span className='dirham-symbol'>&#xea;</span>
                      <span>{item.price}</span>
                    </div>
                  </span>
                </div>
              ))}

              <div className='flex flex-col rounded-md border px-4 py-3 text-lg font-semibold space-y-6'>
                <div className='flex flex-row justify-between items-center'>
                  <span>Tax</span>
                  <div className='flex flex-row items-center gap-1 font-semibold'>
                    <span className='dirham-symbol'>&#xea;</span>
                    <span>{order.taxPrice}</span>
                  </div>
                </div>

                {/* Discount */}
                {order.discount && (
                  <div className='flex flex-row justify-between items-center'>
                    <p>
                      Discount{' '}
                      <span className='text-muted-foreground text-base'>
                        ({order.discount.code})
                      </span>
                    </p>
                    <div className='flex flex-row items-center gap-1 font-semibold'>
                      {order.discount.type !== 'percentage' && (
                        <span className='dirham-symbol'>&#xea;</span>
                      )}
                      <span>
                        {order.discount.type === 'percentage'
                          ? `% ${order.discount.amount}`
                          : `-${order.discount.amount}`}
                      </span>
                    </div>
                  </div>
                )}

                <div className='flex flex-row justify-between items-center'>
                  <span>Total Price</span>
                  <div className='flex flex-row items-center gap-1 font-semibold'>
                    <span className='dirham-symbol'>&#xea;</span>
                    <span>{order.totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          {order.status === 'paid' && session.user.id === order.userId && (
            <CardFooter className='justify-between gap-6 border-t max-sm:flex-col max-sm:items-start'>
              <div className='space-y-2.5 text-lg'>
                <p className='font-medium'>Thank you for shopping with us!</p>
                <span className='text-muted-foreground font-semibold'>
                  Team {APP_NAME}
                </span>
              </div>

              <Button className='text-base' asChild size='lg'>
                <Link href='/my-courses'>View your courses</Link>
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </section>
  );
};

export default OrderSummaryPage;
