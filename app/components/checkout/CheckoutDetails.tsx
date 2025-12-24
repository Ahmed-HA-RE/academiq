'use client';
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';
import { BillingInfo, Cart, Discount, User } from '@/types';
import Image from 'next/image';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { billingInfoSchema } from '@/schema';
import { PhoneInput } from '../ui/phone-input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { CITY_OPTIONS } from '@/lib/utils';
import { createOrder } from '@/lib/actions/order';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Spinner } from '../ui/spinner';
import { Alert, AlertTitle } from '../ui/alert';
import { TriangleAlertIcon } from 'lucide-react';

const CheckoutDetails = ({
  cart,
  discount,
  user,
}: {
  cart: Cart;
  discount: Discount | undefined;
  user: User | undefined;
}) => {
  const router = useRouter();

  const form = useForm<BillingInfo>({
    resolver: zodResolver(billingInfoSchema),
    defaultValues: {
      address: user?.billingInfo?.address || '',
      city: user?.billingInfo?.city || '',
      email: user?.email || '',
      fullName: user?.billingInfo?.fullName || user?.name || '',
      phone: user?.billingInfo?.phone || '',
    },
  });

  const onSubmit = async (data: BillingInfo) => {
    const res = await createOrder({
      billingDetails: data,
      data: cart,
    });

    if (!res.success) {
      toast.error(res.message);
      return;
    }
    if (res.redirect) {
      router.push(res.redirect);
    }
  };

  return (
    <section className='section-spacing'>
      <div className='container'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-5'>
          <div className='space-y-6 md:col-span-2 lg:col-span-2'>
            <Card className='shadow-none'>
              <CardHeader className='border-b'>
                <CardTitle className='text-xl'>Checkout Details</CardTitle>
                <CardDescription className='text-base'>
                  You are about to enroll in {cart.cartItems.length}{' '}
                  {cart.cartItems.length > 1 ? 'courses' : 'course'}.
                </CardDescription>
                {!user?.emailVerified && (
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

                <div className='space-y-6 px-6'>
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
                          <span className='font-semibold'>
                            {discount.amount}
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
                      <span className='text-lg'>{cart.totalPrice}</span>
                    </div>
                  </div>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Button
                      type='submit'
                      className='w-full cursor-pointer'
                      size='lg'
                      disabled={
                        form.formState.isSubmitting || !user?.emailVerified
                      }
                    >
                      {form.formState.isSubmitting ? (
                        <Spinner className='size-7' />
                      ) : (
                        'Pay Now'
                      )}
                    </Button>
                  </form>
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
              <CardHeader>
                <CardTitle className='text-xl'>Billing Information</CardTitle>
                <CardDescription className='text-base'>
                  Please provide your billing information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup className='gap-6'>
                  {/* Full Name */}
                  <Controller
                    name='fullName'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                        <Input
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          className='input'
                          placeholder='Enter your full name'
                          {...field}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <FieldGroup className='lg:flex-row'>
                    {/* Email Address */}
                    <Controller
                      name='email'
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>
                            Email Address
                          </FieldLabel>
                          <Input
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            className='input'
                            placeholder='Enter your email address'
                            {...field}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    {/* Phone Number */}
                    <Controller
                      name='phone'
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>
                            Phone Number
                          </FieldLabel>
                          <PhoneInput
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder='Enter your phone number'
                            defaultCountry='AE'
                            international
                            countryCallingCodeEditable={false}
                            {...field}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                  {/* Address */}
                  <Controller
                    name='address'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                        <Input
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder='Enter your address'
                          className='input'
                          {...field}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  {/* City */}
                  <Controller
                    name='city'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>City</FieldLabel>
                        <Select
                          aria-invalid={fieldState.invalid}
                          onValueChange={field.onChange}
                          value={field.value || ''}
                        >
                          <SelectTrigger
                            id={field.name}
                            className='w-full cursor-pointer'
                          >
                            <SelectValue placeholder='Select a city' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>United Arab Emirates</SelectLabel>
                              {CITY_OPTIONS.UAE.map((city) => (
                                <SelectItem
                                  key={city}
                                  value={city}
                                  className='cursor-pointer'
                                >
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                            <SelectSeparator />
                            <SelectGroup>
                              <SelectLabel>Kingdom of Saudi Arabia</SelectLabel>
                              {CITY_OPTIONS.KSA.map((city) => (
                                <SelectItem
                                  key={city}
                                  value={city}
                                  className='cursor-pointer'
                                >
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                            <SelectSeparator />
                            <SelectGroup>
                              <SelectLabel>Kuwait</SelectLabel>
                              {CITY_OPTIONS.KW.map((city) => (
                                <SelectItem
                                  key={city}
                                  value={city}
                                  className='cursor-pointer'
                                >
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                            <SelectSeparator />
                            <SelectGroup>
                              <SelectLabel>Qatar</SelectLabel>
                              {CITY_OPTIONS.QA.map((city) => (
                                <SelectItem
                                  key={city}
                                  value={city}
                                  className='cursor-pointer'
                                >
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                            <SelectSeparator />
                            <SelectGroup>
                              <SelectLabel>Bahrain</SelectLabel>
                              {CITY_OPTIONS.BH.map((city) => (
                                <SelectItem
                                  key={city}
                                  value={city}
                                  className='cursor-pointer'
                                >
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                            <SelectSeparator />
                            <SelectGroup>
                              <SelectLabel>Oman</SelectLabel>
                              {CITY_OPTIONS.OM.map((city) => (
                                <SelectItem
                                  key={city}
                                  value={city}
                                  className='cursor-pointer'
                                >
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutDetails;
