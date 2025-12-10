'use client';

import { useState } from 'react';

import { ShoppingCartIcon } from 'lucide-react';

import { Button } from '@/app/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/app/components/ui/sheet';
import { Separator } from '@/app/components/ui/separator';

import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Cart } from '@/types';
import DeleteDialog from './shared/DeleteDialog';
import { removeFromCart } from '@/lib/actions/cart';
import { toast } from 'sonner';

const CartSheet = ({ cart }: { cart: Cart | undefined }) => {
  const [open, setOpen] = useState(false);

  const handleDeleteCourse = async (courseId: string) => {
    const res = await removeFromCart(courseId);
    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className='relative w-fit cursor-pointer'>
          <Avatar className='size-9 rounded-sm'>
            <AvatarFallback className='rounded-sm bg-0 hover:bg-accent dark:hover:bg-accent/80 transition'>
              <ShoppingCartIcon className='size-5' />
            </AvatarFallback>
          </Avatar>
          {cart && cart.cartItems.length > 0 ? (
            <Badge className='absolute top-0 right-0 h-4 min-w-5 px-1 rounded-full'>
              {cart.cartItems.length > 0 && cart.cartItems.length}
            </Badge>
          ) : null}
        </div>
      </SheetTrigger>
      <SheetContent
        side='right'
        className='w-full gap-6 p-6 sm:max-w-131 [&>button]:top-7 [&>button]:right-6 [&>button>svg]:size-5'
      >
        <SheetHeader className='p-0'>
          <SheetTitle className='text-2xl'>Cart</SheetTitle>
          <SheetDescription hidden />
        </SheetHeader>
        <div className='flex flex-col justify-between'>
          {!cart || cart.cartItems.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <div className='text-muted-foreground text-lg font-medium'>
                Your cart is empty
              </div>
              <div className='text-muted-foreground mt-2 text-sm'>
                Add items to your cart to see them here.
              </div>
            </div>
          ) : (
            cart.cartItems.map((item) => (
              <div
                key={item.name}
                className='flex border-b pt-4 pb-7 max-sm:flex-col max-sm:gap-y-2 sm:items-center'
              >
                <div className='flex grow items-center gap-4'>
                  <div className='size-18.5 overflow-hidden rounded-lg border '>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={0}
                      height={0}
                      sizes='100vw'
                      className='h-full w-full object-cover object-center '
                    />
                  </div>
                  <h4 className='font-medium'>{item.name}</h4>
                </div>
                <div className='flex grow items-center justify-end gap-3 '>
                  {/* Price */}
                  <div className='flex flex-row items-center gap-1 font-semibold'>
                    <span className='dirham-symbol !text-lg'>&#xea;</span>
                    <span className='font-semibold text-lg'>{item.price}</span>
                  </div>
                  <DeleteDialog
                    title='Are you sure you want to delete it?'
                    description={`This will remove ${item.name} from your cart.`}
                    action={() => handleDeleteCourse(item.courseId)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
        <SheetFooter className='p-0'>
          <div className='space-y-3'>
            {/* items price */}
            <div className='flex items-center justify-between gap-2.5 '>
              <p className='text-muted-foreground'>Price</p>
              <div className='flex flex-row items-center gap-1 font-semibold'>
                <span className='dirham-symbol !text-lg'>&#xea;</span>
                <span className='font-semibold text-lg'>
                  {cart && cart.itemsPrice}
                </span>
              </div>
            </div>
            {/* tax price */}
            <div className='flex items-center justify-between gap-2.5'>
              <p className='text-muted-foreground'>Tax</p>
              <div className='flex flex-row items-center gap-1 font-semibold'>
                <span className='dirham-symbol !text-lg'>&#xea;</span>
                <span className='font-semibold text-lg'>
                  {cart && cart.taxPrice}
                </span>
              </div>
            </div>
            <Separator />
            {/* total price */}
            <div className='flex items-center justify-between gap-2.5'>
              <h5 className='grow text-lg font-semibold'>Total</h5>
              <div className='flex flex-row items-center gap-1 font-semibold'>
                <span className='dirham-symbol !text-lg'>&#xea;</span>
                <span className='font-semibold text-lg'>
                  {cart && cart.totalPrice}
                </span>
              </div>
            </div>
          </div>

          <div className='mt-6 flex flex-col gap-2'>
            <Button asChild size='lg' className='w-full rounded-lg'>
              <Link href='/checkout'>Checkout</Link>
            </Button>
            <Button
              onClick={() => setOpen(!open)}
              size='lg'
              variant='outline'
              className='w-full rounded-lg cursor-pointer'
            >
              Cancel
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
