'use client';

import { User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { Spinner } from '../ui/spinner';
import { updateUserAsAdminSchema } from '@/schema';
import z from 'zod';
import { FieldGroup, FieldError, Field, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { USERS_ROLES } from '@/lib/constants';
import { PhoneInput } from '../ui/phone-input';
import { CITY_OPTIONS } from '@/lib/utils';
import { Button } from '../ui/button';
const EditUserForm = ({ user }: { user: User }) => {
  const form = useForm<z.infer<typeof updateUserAsAdminSchema>>({
    resolver: zodResolver(updateUserAsAdminSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.emailVerified ? 'verified' : 'unverified',
      phone: user.billingInfo?.phone || '',
      address: user.billingInfo?.address || '',
      city: user.billingInfo?.city || '',
    },
    mode: 'all',
  });

  const onSubmit = async (data: z.infer<typeof updateUserAsAdminSchema>) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Name */}
          <Controller
            control={form.control}
            name='name'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Name</FieldLabel>
                <Input
                  placeholder='Update user name'
                  className='input'
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          {/* Email */}
          <Controller
            control={form.control}
            name='email'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Email</FieldLabel>
                <Input
                  placeholder='Update user email'
                  className='input'
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Status */}
          <Controller
            control={form.control}
            name='status'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Status</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id={'status'}
                    className='w-full cursor-pointer input'
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value='verified' className='cursor-pointer'>
                        Verified
                      </SelectItem>
                      <SelectItem value='unverified' className='cursor-pointer'>
                        Unverified
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          {/* Role */}
          <Controller
            control={form.control}
            name='role'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Role</FieldLabel>
                <Select
                  aria-invalid={fieldState.invalid}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id={'role'}
                    className='w-full cursor-pointer input'
                  >
                    <SelectValue placeholder='Select a role' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Role</SelectLabel>
                      {USERS_ROLES.filter((role) => role.value !== 'all').map(
                        (role) => (
                          <SelectItem
                            key={role.label}
                            value={role.value}
                            className='cursor-pointer'
                          >
                            {role.label}
                          </SelectItem>
                        )
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Phone Number  */}
          <Controller
            name='phone'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                <PhoneInput
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder='Enter your WhatsApp 
                    number'
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
                  value={field.value}
                >
                  <SelectTrigger
                    id={field.name}
                    className='w-full cursor-pointer'
                  >
                    <SelectValue placeholder='Select a city' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>City</SelectLabel>
                      {CITY_OPTIONS.map((city) => (
                        <SelectItem
                          key={city.value}
                          value={city.value}
                          className='cursor-pointer'
                        >
                          {city.label}
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
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
          {/* Avatar */}
        </div>
        <Button
          className='cursor-pointer text-base'
          size={'lg'}
          type='submit'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              Updating <Spinner />{' '}
            </>
          ) : (
            'Update'
          )}
        </Button>
      </FieldGroup>
    </form>
  );
};

export default EditUserForm;
