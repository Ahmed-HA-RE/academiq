'use client';
import { Button } from '@/app/components/ui/button';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { BillingInfo, Cart, User } from '@/types';
import Image from 'next/image';
import DeleteDialog from '@/app/components/shared/DeleteDialog';
import { removeFromCart } from '@/lib/actions/cart';
import { applyDiscount } from '@/lib/actions/discount';
import { toast } from 'react-hot-toast';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { TriangleAlertIcon } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/app/components/ui/input';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Discount } from '@/types';
import { Field, FieldError } from '../ui/field';
import { applyDiscountSchema, billingInfoSchema } from '@/schema';
import z from 'zod';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/lib/actions/order';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import CartAction from './CartAction';
import BillingDetails from './BillingDetails';
import ScreenSpinner from '../ScreenSpinner';

const CartDetails = ({
  cart,
  discount,
  user,
}: {
  cart: Cart | undefined;
  discount: Discount | undefined;
  user: User;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [billingDetailsData, setBillingDetailsData] = useState<BillingInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    country: '',
  });
  const [activeAccordionItem, setActiveAccordionItem] =
    useState<string>('billing-details');

  const couponForm = useForm<z.infer<typeof applyDiscountSchema>>({
    resolver: zodResolver(applyDiscountSchema),
    defaultValues: {
      code: discount?.code || '',
    },
    mode: 'onSubmit',
  });

  const billingDetailsForm = useForm<BillingInfo>({
    resolver: zodResolver(billingInfoSchema),
    defaultValues: {
      address: user?.billingInfo?.address || '',
      country: user?.billingInfo?.country || '',
      email: user?.billingInfo?.email || '',
      fullName: user?.billingInfo?.fullName || '',
      phone: user?.billingInfo?.phone || '',
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

  const handleSubmitBillingDetails = async (data: BillingInfo) => {
    setBillingDetailsData(data);
    setActiveAccordionItem('order-summary');
  };

  const onSubmitCoupon = async (data: z.infer<typeof applyDiscountSchema>) => {
    const res = await applyDiscount(data.code);
    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    router.refresh();
  };

  const handleCreateOrder = () => {
    startTransition(async () => {
      if (cart) {
        const res = await createOrder({
          data: cart,
          billingDetails: billingDetailsData,
        });
        if (!res || !res.redirectUrl || !res.success) {
          toast.error(res.message);
          return;
        }
        router.push(res.redirectUrl);
      }
    });
  };

  return (
    <>
      {couponForm.formState.isSubmitting && (
        <ScreenSpinner mutate={true} text='Applying..' />
      )}
      <section className='section-spacing'>
        <div className='container'>
          {!cart || cart.cartItems.length === 0 ? (
            <div className='min-h-[50vh]'>
              <Alert
                variant='destructive'
                className='border-destructive max-w-md mx-auto'
              >
                <TriangleAlertIcon />
                <AlertDescription className='block'>
                  Your cart is empty.
                  <Link href='/courses' className='underline ms-1'>
                    Start learning by browsing our courses.
                  </Link>
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-15 lg:grid-cols-3 items-start'>
              {/* Left Column - cartItems */}
              <div className='space-y-3 lg:col-span-2'>
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
                      href={`/course/${item.courseId}`}
                      className='flex flex-row items-center gap-4'
                    >
                      <div className='max-w-[100px]'>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={0}
                          height={0}
                          sizes='100vw'
                          className='rounded-md w-full object-cover'
                        />
                      </div>
                      <h2 className='text-base font-medium'>{item.name}</h2>
                    </Link>
                    <div className='flex items-center justify-end gap-4'>
                      <div className='flex flex-row items-center gap-1 font-medium text-lg'>
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
              <div className='flex flex-col gap-6 '>
                {/* Coupon Code */}
                <Card className='shadow-none'>
                  <CardHeader className='border-b'>
                    <CardTitle className='text-xl'>Coupon Code</CardTitle>
                    <CardDescription className='text-base'>
                      Enter code to get discount
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      className='flex gap-3'
                      onSubmit={couponForm.handleSubmit(onSubmitCoupon)}
                    >
                      <Controller
                        name='code'
                        control={couponForm.control}
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
                        disabled={
                          couponForm.formState.isSubmitting || !!discount
                        }
                      >
                        Apply
                      </Button>
                    </form>
                  </CardContent>
                </Card>
                {/* Accordion billingDetails and order summary */}
                {cart && cart.cartItems.length > 0 && (
                  <Card className='shadow-none'>
                    <CardContent className='px-3.5'>
                      <Accordion
                        type='single'
                        collapsible
                        className='w-full space-y-2'
                        value={activeAccordionItem}
                      >
                        <AccordionItem
                          value={`billing-details`}
                          className='rounded-md border!'
                        >
                          <AccordionTrigger className='px-5 cursor-pointer'>
                            Billing Details
                          </AccordionTrigger>
                          <AccordionContent className='px-5'>
                            <BillingDetails
                              form={billingDetailsForm}
                              onSubmit={billingDetailsForm.handleSubmit(
                                handleSubmitBillingDetails,
                              )}
                            />
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem
                          value={`order-summary`}
                          className='rounded-md border!'
                        >
                          <AccordionTrigger className='px-5 cursor-pointer'>
                            Order Summary
                          </AccordionTrigger>
                          <AccordionContent className='px-5'>
                            <CartAction
                              cart={cart}
                              discount={discount}
                              handleCreateOrder={handleCreateOrder}
                              isPending={isPending}
                              setActiveAccordionItem={setActiveAccordionItem}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CartDetails;
