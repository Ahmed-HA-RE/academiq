'use client';

import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Separator } from '@/app/components/ui/separator';
import { Cart } from '@/types';
import Image from 'next/image';

const CheckoutDetails = ({ cart }: { cart: Cart }) => {
  const discount = 9.0;

  return (
    <section className='mb-10'>
      <div className='container'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-5'>
          <div className='space-y-6 md:col-span-2 lg:col-span-2'>
            {/* Coupon Code */}
            <Card className='shadow-none'>
              <CardHeader className='border-b'>
                <CardTitle className='text-xl'>Coupon Code</CardTitle>
                <CardDescription className='text-base'>
                  Enter code to get discount instantly
                </CardDescription>
              </CardHeader>
              <CardContent className='flex gap-3'>
                <Input
                  className='input'
                  type='text'
                  placeholder='Add discount code'
                />
                <Button className='cursor-pointer'>Apply</Button>
              </CardContent>
            </Card>

            {/* Shopping Cart */}
            <Card className='shadow-none'>
              <CardHeader className='border-b'>
                <CardTitle className='text-xl'>Shopping Cart</CardTitle>
                <CardDescription className='text-base'>
                  You have {cart.cartItems.length} items in your cart
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6 px-0'>
                <div className='flex flex-col gap-9'>
                  {cart.cartItems.map((item) => (
                    <div
                      key={item.name}
                      className='flex justify-between gap-4 px-6 max-sm:flex-col sm:items-center'
                    >
                      <div className='flex h-full items-center gap-4'>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={0}
                          height={0}
                          sizes='100vw'
                          className='size-17 rounded-sm object-cover'
                        />
                        <div className='flex flex-col gap-1'>
                          <p className='font-medium'>{item.name}</p>
                        </div>
                      </div>
                      <div className='sm:text-end'>
                        <div className='flex flex-row items-center gap-1 font-semibold '>
                          <span className='dirham-symbol !text-lg'>&#xea;</span>
                          <span className='text-lg'>{item.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className='space-y-3.5 px-6'>
                  <div className='flex items-center justify-between gap-3'>
                    <span className='text-lg'>Subtotal</span>
                    <div className='flex flex-row items-center gap-1 font-semibold '>
                      <span className='dirham-symbol !text-lg'>&#xea;</span>
                      <span className='text-lg'>{cart.itemsPrice}</span>
                    </div>
                  </div>
                  <div className='flex items-center justify-between gap-3'>
                    <span className='text-lg'>Tax Cost</span>
                    <div className='flex flex-row items-center gap-1 font-semibold '>
                      <span className='dirham-symbol !text-lg'>&#xea;</span>
                      <span className='text-lg'>{cart.taxPrice}</span>
                    </div>
                  </div>

                  <div className='mb-6 flex items-center justify-between gap-3'>
                    <span className='text-lg'>Discount (-)</span>
                    <div className='flex flex-row items-center gap-1 font-semibold '>
                      <span className='dirham-symbol !text-lg'>&#xea;</span>
                      <span className='text-lg'>{discount}</span>
                    </div>
                  </div>
                </div>

                <Separator className='mb-6' />

                <div className='space-y-6 px-6'>
                  <div className='flex items-center justify-between gap-3'>
                    <span className='text-lg font-medium'>Total</span>
                    <div className='flex flex-row items-center gap-1 font-semibold'>
                      <span className='dirham-symbol !text-lg'>&#xea;</span>
                      <span className='text-lg'>{cart.totalPrice}</span>
                    </div>
                  </div>
                  <Button className='w-full cursor-pointer' size='lg'>
                    Pay Now
                  </Button>
                  <p className='text-muted-foreground'>
                    All payments are secure and encrypted.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className='md:col-span-2 lg:col-span-3'>
            <Card className='shadow-none'>
              <CardContent></CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutDetails;
