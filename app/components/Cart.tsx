'use client';

import { useState } from 'react';

import { ShoppingCart, Trash2Icon } from 'lucide-react';

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import Link from 'next/link';
import Image from 'next/image';

const cartItems = [
  {
    id: 1,
    name: 'Polarised sunglasses',
    size: 'Free Style',
    price: 15,
    image:
      'https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/shopping-cart/image-7.png',
  },
  {
    id: 2,
    name: 'Lyocell-blend bucket hat',
    size: 'M',
    price: 10,
    image:
      'https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/shopping-cart/image-6.png',
  },
  {
    id: 3,
    name: 'Regular Fit Polo shirt',
    size: 'XL',
    price: 32,
    image:
      'https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/shopping-cart/image-5.png',
  },
  {
    id: 4,
    name: 'Regular Fit Velvet overshirt',
    size: 'XL',
    price: 50,
    image:
      'https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/shopping-cart/image-4.png',
  },
];

const Cart = () => {
  const [deletedItems, setDeletedItems] = useState<Set<number>>(new Set());
  const [openPopovers, setOpenPopovers] = useState<Record<number, boolean>>({});
  const [open, setOpen] = useState(false);

  const handleDeleteItem = (itemId: number) => {
    setDeletedItems((prev) => new Set([...prev, itemId]));
  };

  // Filter out deleted items
  const activeCartItems = cartItems.filter(
    (item) => !deletedItems.has(item.id)
  );

  const subtotal = activeCartItems.reduce((total: number, item) => {
    return total + item.price;
  }, 0);

  const total = subtotal;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className='cursor-pointer'>
          <ShoppingCart size={20} />
        </Button>
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
          {activeCartItems.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <div className='text-muted-foreground text-lg font-medium'>
                Your cart is empty
              </div>
              <div className='text-muted-foreground mt-2 text-sm'>
                Refresh the page to restore items
              </div>
            </div>
          ) : (
            activeCartItems.map((item) => (
              <div
                key={item.id}
                className='flex border-b pt-4 pb-7 max-sm:flex-col max-sm:gap-y-2 sm:items-center'
              >
                <div className='flex grow items-center gap-4'>
                  <div className='size-18.5 overflow-hidden rounded-lg border'>
                    {/* <Image
                      src={item.image}
                      alt={item.name}
                      width={74}
                      height={74}
                    /> */}
                    <img
                      src={item.image}
                      alt={item.name}
                      width={74}
                      height={74}
                    />
                  </div>
                  <h4 className='font-medium'>{item.name}</h4>
                </div>
                <div className='flex grow items-center gap-3 max-sm:justify-end sm:flex-col sm:items-end'>
                  <span className='text-lg font-semibold'>
                    ${item.price.toFixed(2)}
                  </span>
                  <Popover
                    open={openPopovers[item.id] || false}
                    onOpenChange={(open) =>
                      setOpenPopovers((prev) => ({ ...prev, [item.id]: open }))
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='cursor-pointer'
                      >
                        <Trash2Icon className='size-6' />
                        <span className='sr-only'>Delete Item</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-80'>
                      <div className='flex flex-col items-center gap-4'>
                        <div className='flex aspect-square size-12 items-center justify-center rounded-full bg-red-500/10'>
                          <Trash2Icon className='text-destructive size-6' />
                        </div>
                        <div className='text-center font-semibold text-balance'>
                          Are you sure you want to remove this item
                        </div>
                        <div className='grid w-full grid-cols-2 gap-2'>
                          <Button
                            variant='secondary'
                            size='sm'
                            onClick={() =>
                              setOpenPopovers((prev) => ({
                                ...prev,
                                [item.id]: false,
                              }))
                            }
                          >
                            Cancel
                          </Button>
                          <Button
                            variant='destructive'
                            size='sm'
                            onClick={() => {
                              handleDeleteItem(item.id);
                              setOpenPopovers((prev) => ({
                                ...prev,
                                [item.id]: false,
                              }));
                            }}
                          >
                            Delete Item
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            ))
          )}
        </div>
        <SheetFooter className='p-0'>
          <div className='space-y-3'>
            <div className='flex items-center justify-between gap-2.5'>
              <p className='text-muted-foreground'>Price</p>
              <p className='font-semibold'>${subtotal.toFixed(2)}</p>
            </div>
            <div className='flex items-center justify-between gap-2.5'>
              <p className='text-muted-foreground'>Discount</p>
              <p className='font-semibold'>-${(2).toFixed(2)}</p>
            </div>
            <Separator />
            <div className='flex items-center justify-between gap-2.5'>
              <h5 className='grow text-lg font-semibold'>Total</h5>
              <p className='text-lg font-semibold'>${total.toFixed(2)}</p>
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

export default Cart;
