'use client';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { SERVER_URL } from '@/lib/constants';
import { Spinner } from '../ui/spinner';
import { FormEvent, useTransition } from 'react';

const CheckoutPaymentForm = ({ orderId }: { orderId: string }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      if (!stripe || !elements) return;

      await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${SERVER_URL}/success?orderId=${orderId}`,
        },
      });
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className='flex flex-col gap-6 col-span-1 lg:col-span-3'
    >
      <Card className='gap-4'>
        <CardHeader className='px-0 gap-0'>
          <CardTitle className='text-xl px-4'>Payment Information</CardTitle>
        </CardHeader>
        <CardContent className='px-4'>
          <PaymentElement
            options={{
              layout: {
                type: 'tabs',
              },
            }}
          />
          <Button
            size={'lg'}
            className='cursor-pointer w-full text-base mt-6'
            disabled={!stripe || !elements || isPending}
            type='submit'
          >
            {isPending ? (
              <>
                {' '}
                <Spinner className='size-6' /> Paying...{' '}
              </>
            ) : (
              'Pay Now'
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};
export default CheckoutPaymentForm;
