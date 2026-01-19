'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';
import { Order, User } from '@/types';
import Image from 'next/image';

import { Alert, AlertTitle } from '../ui/alert';
import { TriangleAlertIcon } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutPaymentForm from './CheckoutPaymentForm';
import { useTheme } from 'next-themes';

const CheckoutDetails = ({
  user,
  clientSecret,
  order,
}: {
  user: User;
  clientSecret: string;
  order: Order;
}) => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_KEY as string,
    {
      developerTools: { assistant: { enabled: false } },
    }
  );
  const { theme } = useTheme();

  return (
    <section className='section-spacing'>
      <div className='container'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-5'>
          <div className='space-y-6 col-span-1 lg:col-span-2'>
            <Card className='shadow-none'>
              <CardHeader className='border-b'>
                <CardTitle className='text-xl'>Checkout Details</CardTitle>
                <CardDescription className='text-base'>
                  You are about to enroll in {order.orderItems.length}{' '}
                  {order.orderItems.length > 1 ? 'courses' : 'course'}.
                </CardDescription>
                {!user.emailVerified && (
                  <Alert className='bg-destructive dark:bg-destructive/60 border-none text-white mt-4'>
                    <TriangleAlertIcon />
                    <AlertTitle>
                      Please verify your email to proceed with the checkout.
                    </AlertTitle>
                  </Alert>
                )}
              </CardHeader>
              <CardContent className='space-y-6 px-0'>
                <div className='flex flex-col gap-9'>
                  {order.orderItems.map((item) => (
                    <div
                      key={item.name}
                      className='flex flex-col justify-between gap-2 px-6'
                    >
                      <div className='flex items-center gap-4'>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={0}
                          height={0}
                          sizes='100vw'
                          className='w-full rounded-sm max-w-[120px] object-cover'
                        />
                        <p className='font-medium'>{item.name}</p>
                      </div>

                      <div className='flex flex-row items-center justify-end gap-1 font-semibold '>
                        <span className='dirham-symbol !text-lg'>&#xea;</span>
                        <span className='text-lg'>{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className='space-y-6 px-6'>
                  <div className='flex items-center justify-between gap-3'>
                    <span className='text-lg'>Subtotal</span>
                    <div className='flex flex-row items-center gap-1 font-semibold '>
                      <span className='dirham-symbol !text-lg'>&#xea;</span>
                      <span className='text-lg'>{order.itemsPrice}</span>
                    </div>
                  </div>
                  <div className='flex items-center justify-between gap-3'>
                    <span className='text-lg'>Tax Cost</span>
                    <div className='flex flex-row items-center gap-1 font-semibold '>
                      <span className='dirham-symbol !text-lg'>&#xea;</span>
                      <span className='text-lg'>{order.taxPrice}</span>
                    </div>
                  </div>

                  {/* Discount if applicable */}
                  {order.discount && (
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>
                        Discount ({order.discount.code})
                      </span>
                      {order.discount.type === 'percentage' ? (
                        <p className='font-semibold'>
                          -{order.discount.amount}%
                        </p>
                      ) : (
                        <div className='flex flex-row items-center gap-1 font-medium'>
                          <span className='dirham-symbol'>-&#xea;</span>
                          <span className='font-semibold'>
                            {order.discount.amount}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Separator className='mb-6' />

                <div className='space-y-6 px-6'>
                  <div className='flex items-center justify-between gap-3'>
                    <span className='text-lg font-medium'>Total</span>
                    <div className='flex flex-row items-center gap-1 font-semibold'>
                      <span className='dirham-symbol !text-lg'>&#xea;</span>
                      <span className='text-lg'>{order.totalPrice}</span>
                    </div>
                  </div>
                  <p className='text-muted-foreground'>
                    All payments are secure and encrypted.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: theme === 'dark' ? 'night' : 'stripe',
              },
            }}
          >
            <CheckoutPaymentForm orderId={order.id} />
          </Elements>
        </div>
      </div>
    </section>
  );
};

export default CheckoutDetails;
