'use client';
import { Button } from '@/app/components/ui/button';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';
import { Cart } from '@/types';
import Image from 'next/image';
import DeleteDialog from '@/app/components/shared/DeleteDialog';
import { removeFromCart } from '@/lib/actions/cart';
import { applyDiscount } from '@/lib/actions/discount';
import { toast } from 'sonner';
import { Alert, AlertTitle } from '@/app/components/ui/alert';
import { TriangleAlertIcon } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { SERVER_URL } from '@/lib/constants';
import { Input } from '@/app/components/ui/input';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Discount } from '@/types';
import ScreenSpinner from './ScreenSpinner';
import { Field, FieldError, FieldGroup } from './ui/field';
import { applyDiscountSchema } from '@/schema';
import z from 'zod';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from './ui/spinner';

const CartDetails = ({
  cart,
  session,
  discount,
}: {
  cart: Cart | undefined;
  session: typeof auth.$Infer.Session | null;
  discount: Discount | undefined;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof applyDiscountSchema>>({
    resolver: zodResolver(applyDiscountSchema),
    defaultValues: {
      code: discount?.code || '',
    },
    mode: 'onSubmit',
  });

  const handleDeleteCourse = async (courseId: string) => {
    const res = await removeFromCart(courseId);
    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
  };

  const onSubmit = async (data: z.infer<typeof applyDiscountSchema>) => {
    const res = await applyDiscount(data.code);
    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
  };

  return (
    <section className='section-spacing'>
      {form.formState.isSubmitting && <ScreenSpinner mutate />}
      <div className='container'>
        {!cart || cart.cartItems.length === 0 ? (
          <div className='min-h-[50vh]'>
            <Alert
              variant='destructive'
              className='border-destructive max-w-md mx-auto'
            >
              <TriangleAlertIcon />
              <AlertTitle>
                Your cart is empty.
                <Link href='/courses' className='underline ms-1'>
                  Start learning by browsing our courses.
                </Link>
              </AlertTitle>
            </Alert>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-15 lg:grid-cols-3 items-start'>
            {/* Left Column - cartItems */}
            <div className='space-y-3 lg:col-span-2 order-2 lg:order-1'>
              <div className='flex w-full items-center justify-between'>
                <div className='text-2xl font-semibold'>Your Cart</div>
                <div className='text-muted-foreground'>
                  {cart && cart.cartItems.length} Items in cart
                </div>
              </div>
              {cart.cartItems.map((item) => (
                <div
                  key={item.name}
                  className='flex flex-col sm:flex-row justify-between border-t pt-7 pb-4 sm:items-center  gap-4 '
                >
                  <Link
                    href={`/course/${item.slug}`}
                    className='flex flex-row items-center gap-4'
                  >
                    <div className='size-30'>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={0}
                        height={0}
                        sizes='100vw'
                        className='rounded-md w-full h-full object-cover'
                      />
                    </div>
                    <h2 className='text-lg font-medium'>{item.name}</h2>
                  </Link>
                  <div className='flex items-center justify-end gap-4'>
                    <div className='flex flex-row items-center gap-1 font-medium text-xl'>
                      <span className='dirham-symbol'>&#xea;</span>
                      <span className='font-semibold'>{item.price}</span>
                    </div>
                    <DeleteDialog
                      title='Are you sure you want to delete it?'
                      description={`This will remove ${item.name} from your cart.`}
                      action={() => handleDeleteCourse(item.courseId)}
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Right Col */}
            <div className='flex flex-col items-center gap-6 order-1 lg:order-2'>
              <Card className='w-full max-w-lg shadow'>
                <CardHeader>
                  <CardTitle className='text-xl'>Apply Coupon</CardTitle>
                  <CardDescription className='text-base'>
                    Using a Promo Code ?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className='flex-row gap-4'>
                      <Controller
                        name='code'
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <Input
                              type='text'
                              placeholder='Coupon Code'
                              className='w-full input'
                              aria-invalid={fieldState.invalid}
                              disabled={!!discount}
                              {...field}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                      <Button
                        className='rounded-lg cursor-pointer text-base'
                        type='submit'
                        disabled={form.formState.isSubmitting || !!discount}
                      >
                        Apply
                      </Button>
                    </FieldGroup>
                  </form>
                </CardContent>
              </Card>
              {cart && cart.cartItems.length > 0 && (
                <Card className='w-full gap-8 shadow order-1 lg:order-2'>
                  <CardContent>
                    <div className='space-y-6'>
                      <h5 className='text-xl font-semibold'> Price Details</h5>
                      <div className='space-y-5'>
                        <Separator />
                        <div className='flex items-center justify-between'>
                          <span className='text-muted-foreground'>
                            Subtotal
                          </span>
                          <div className='flex flex-row items-center gap-1 font-medium'>
                            <span className='dirham-symbol'>&#xea;</span>
                            <span className='font-semibold'>
                              {cart.itemsPrice}
                            </span>
                          </div>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-muted-foreground'>Tax</span>
                          <div className='flex flex-row items-center gap-1 font-medium'>
                            <span className='dirham-symbol'>&#xea;</span>
                            <span className='font-semibold'>
                              {cart.taxPrice}
                            </span>
                          </div>
                        </div>

                        {/* Discount if applicable */}
                        {discount && (
                          <div className='flex items-center justify-between'>
                            <span className='text-muted-foreground'>
                              Discount ({discount.code})
                            </span>
                            {discount.type === 'percentage' ? (
                              <p className='font-semibold'>
                                -{discount.amount}%
                              </p>
                            ) : (
                              <div className='flex flex-row items-center gap-1 font-medium'>
                                <span className='dirham-symbol'>-&#xea;</span>
                                <span className='font-semibold'>
                                  {discount.amount}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        <Separator />
                        <div className='flex items-center justify-between'>
                          <span className='text-lg font-semibold'>Total</span>
                          <div className='flex flex-row items-center gap-1 font-medium'>
                            <span className='dirham-symbol'>&#xea;</span>
                            <span className='font-semibold'>
                              {cart.totalPrice}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className='flex-col items-start gap-3.5'>
                    <Button
                      type='submit'
                      className='w-full cursor-pointer'
                      disabled={isPending}
                      onClick={() => {
                        startTransition(() => {
                          router.push(
                            session
                              ? `/checkout`
                              : `/login?callbackUrl=${SERVER_URL}/checkout`
                          );
                        });
                      }}
                    >
                      {isPending ? (
                        <Spinner className='size-7 ' />
                      ) : (
                        'Proceed to Checkout'
                      )}
                    </Button>
                    <div className='flex items-center gap-2'>
                      <p>We Accept:</p>
                      <div className='flex items-center gap-4'>
                        <Image
                          src='/images/visa.png'
                          alt='Visa'
                          width={45}
                          height={45}
                          loading='eager'
                          className='w-auto h-auto'
                        />
                        <Image
                          src='/images/master-card.png'
                          alt='Mastercard'
                          width={40}
                          height={40}
                          loading='eager'
                          className='w-auto h-auto'
                        />
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CartDetails;
