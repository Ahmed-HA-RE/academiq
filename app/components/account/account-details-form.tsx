'use client';
import { UpdateAccountDetails, User } from '@/types';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { updateAccountDetailsSchema } from '@/schema';
import { Card, CardContent } from '../ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '../ui/field';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { LIST_COUNTRIES } from '@/lib/utils';
import { PhoneInput } from '../ui/phone-input';
import Image from 'next/image';
import { Button } from '../ui/button';
import { updateAccountDetails } from '@/lib/actions/user/update-user-account';
import { Avatar } from '../ui/avatar';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploaderBtn from '../shared/ImageUploaderBtn';

const AccountDetailsForm = ({
  user,
  providerId,
}: {
  user: User;
  providerId: string;
}) => {
  const router = useRouter();

  const form = useForm<UpdateAccountDetails>({
    resolver: zodResolver(updateAccountDetailsSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      image: user.image,
      billingInfo: {
        name: user.billingInfo?.name || '',
        address: user.billingInfo?.address || '',
        country: user.billingInfo?.country || '',
        email: user.billingInfo?.email || '',
        phone: user.billingInfo?.phone || '',
      },
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: UpdateAccountDetails) => {
    const res = await updateAccountDetails(data);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message);
    router.refresh();
  };

  const uploadedImage = form.watch('image');

  return (
    <div className='w-full flex-1/2'>
      <Card>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            <FieldGroup className='gap-5'>
              {/* Name */}
              <Controller
                name='name'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className='leading-5' htmlFor={field.name}>
                      Full Name
                    </FieldLabel>
                    <Input
                      type='text'
                      id={field.name}
                      placeholder='Enter your full name'
                      aria-invalid={fieldState.invalid}
                      className='input'
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Email */}
              <Controller
                name='email'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className='leading-5' htmlFor={field.name}>
                      Email address
                    </FieldLabel>
                    <Input
                      type='email'
                      id={field.name}
                      placeholder='Enter your email address'
                      aria-invalid={fieldState.invalid}
                      className='input'
                      disabled={providerId !== 'credential'}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <FieldSeparator />

              {/* Billing Full Name */}
              <Controller
                name='billingInfo.name'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Billing Full Name
                    </FieldLabel>
                    <Input
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      className='input'
                      placeholder='Enter your billing full name'
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/*  Billing Email Address */}
              <Controller
                name='billingInfo.email'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Billing Email Address
                    </FieldLabel>
                    <Input
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      className='input'
                      placeholder='Enter your billing email address'
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
                name='billingInfo.phone'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Billing Phone Number
                    </FieldLabel>
                    <PhoneInput
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder='Enter your billing phone number'
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
              {/* Address */}
              <Controller
                name='billingInfo.address'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Billing Address
                    </FieldLabel>
                    <Input
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder='Enter your billing address'
                      className='input'
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Country */}
              <Controller
                name='billingInfo.country'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Country</FieldLabel>
                    <Select
                      aria-invalid={fieldState.invalid}
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <SelectTrigger
                        id={field.name}
                        className='w-full cursor-pointer input'
                      >
                        <SelectValue placeholder='Select a country' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {LIST_COUNTRIES.map((country) => (
                            <SelectItem
                              key={country}
                              value={country}
                              className='cursor-pointer'
                            >
                              {country}
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
              <FieldSeparator />
              {/* Profile Image */}
              <Controller
                name={'image'}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Profile Image</FieldLabel>
                    <div className='flex flex-row gap-6 items-center'>
                      <Avatar className='size-25'>
                        <Suspense>
                          <Image
                            src={uploadedImage || user.image}
                            alt='Profile Image'
                            width={100}
                            height={100}
                            className='object-cover'
                          />
                        </Suspense>
                      </Avatar>
                      <ImageUploaderBtn form={form} />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button
                disabled={form.formState.isSubmitting}
                type='submit'
                className='rounded-full text-base self-end cursor-pointer'
              >
                {form.formState.isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountDetailsForm;
