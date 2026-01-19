'use client ';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { Cart, Discount } from '@/types';
import { Separator } from '../ui/separator';
import Image from 'next/image';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

const CartAction = ({
  cart,
  discount,
  isPending,
  handleCreateOrder,
  setActiveAccordionItem,
}: {
  cart: Cart;
  discount: Discount | undefined;
  isPending: boolean;
  handleCreateOrder: () => void;
  setActiveAccordionItem: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <Card className='border-0 shadow-none py-0 pt-4 gap-0'>
      <CardContent className='px-0'>
        <div className='space-y-6'>
          <div className='space-y-5'>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground'>Subtotal</span>
              <div className='flex flex-row items-center gap-1 font-medium'>
                <span className='dirham-symbol'>&#xea;</span>
                <span className='font-semibold'>{cart.itemsPrice}</span>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground'>Tax</span>
              <div className='flex flex-row items-center gap-1 font-medium'>
                <span className='dirham-symbol'>&#xea;</span>
                <span className='font-semibold'>{cart.taxPrice}</span>
              </div>
            </div>

            {/* Discount if applicable */}
            {discount && (
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>
                  Discount ({discount.code})
                </span>
                {discount.type === 'percentage' ? (
                  <p className='font-semibold'>-{discount.amount}%</p>
                ) : (
                  <div className='flex flex-row items-center gap-1 font-medium'>
                    <span className='dirham-symbol'>-&#xea;</span>
                    <span className='font-semibold'>{discount.amount}</span>
                  </div>
                )}
              </div>
            )}

            <div className='flex items-center justify-between'>
              <span className='text-lg font-semibold'>Total</span>
              <div className='flex flex-row items-center gap-1 font-medium'>
                <span className='dirham-symbol'>&#xea;</span>
                <span className='font-semibold'>{cart.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <Separator className='my-4' />
      <CardFooter className='flex-col items-start gap-3.5 px-0'>
        <div className='flex gap-4 items-center w-full'>
          <Button
            className='cursor-pointer group flex-1'
            onClick={() => setActiveAccordionItem('billing-details')}
          >
            <ArrowLeftIcon
              className='-ms-1 group-hover:-translate-x-0.5 opacity-70 transition-transform'
              size={16}
            />
            Previous Step
          </Button>
          <Button
            type='submit'
            className='cursor-pointer group flex-1  '
            disabled={isPending}
            onClick={handleCreateOrder}
          >
            {isPending ? (
              <Spinner className='size-7' />
            ) : (
              <>
                Proceed to Checkout{' '}
                <ArrowRightIcon
                  className='-ms-1 group-hover:translate-x-0.5 opacity-70 transition-transform'
                  size={16}
                />
              </>
            )}
          </Button>
        </div>
        <div className='flex items-center gap-2'>
          <p>We Accept:</p>
          <div className='flex items-center gap-2'>
            <Image
              src='/images/visa.png'
              alt='Visa'
              width={40}
              height={40}
              loading='eager'
            />
            <Image
              src='/images/master-card.png'
              alt='Mastercard'
              width={38}
              height={38}
              loading='eager'
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CartAction;
