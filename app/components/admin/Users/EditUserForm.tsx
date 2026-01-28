'use client';

import { UpdateUserAsAdmin, User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { Spinner } from '../../ui/spinner';
import { updateUserAsAdminSchema } from '@/schema';
import { FieldGroup, FieldError, Field, FieldLabel } from '../../ui/field';
import { Input } from '../../ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { USERS_ROLES } from '@/lib/constants';
import { PhoneInput } from '../../ui/phone-input';
import { LIST_COUNTRIES } from '@/lib/utils';
import { Button } from '../../ui/button';
import AvatarUpload from '../../AvatarUpload';
import { updateUserAsAdmin } from '@/lib/actions/admin/user-mutation';
import { useRouter } from 'next/navigation';

const EditUserForm = ({
  user,
  providerId,
}: {
  user: User;
  providerId: string;
}) => {
  const router = useRouter();

  const form = useForm<UpdateUserAsAdmin>({
    resolver: zodResolver(updateUserAsAdminSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.emailVerified ? 'verified' : 'unverified',
      phone: user.billingInfo?.phone || '',
      address: user.billingInfo?.address || '',
      country: user.billingInfo?.country || '',
      fullName: user.billingInfo?.fullName || '',
    },
  });

  const onSubmit = async (data: UpdateUserAsAdmin) => {
    const res = await updateUserAsAdmin(user.id, data);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success('User updated successfully!');
    router.push('/admin-dashboard/users');
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 w-full'>
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
                  disabled={providerId !== 'credentials'}
                />
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
              <Field
                className={user.role !== 'user' ? 'lg:col-span-2' : ''}
                data-invalid={fieldState.invalid}
              >
                <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                <Select
                  aria-invalid={fieldState.invalid}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id={field.name}
                    className='w-full cursor-pointer input'
                    disabled={user.banned}
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
                        ),
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

          {/* Status */}
          {user.role === 'user' && (
            <>
              <Controller
                control={form.control}
                name='status'
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id={field.name}
                        className='w-full cursor-pointer input'
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem
                            value='verified'
                            className='cursor-pointer'
                          >
                            Verified
                          </SelectItem>
                          <SelectItem
                            value='unverified'
                            className='cursor-pointer'
                          >
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

              <Controller
                name='phone'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                    <PhoneInput
                      id={field.name}
                      aria-invalid={fieldState.invalid}
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
              {/* Country */}
              <Controller
                name='country'
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
              {/* Full Name ( billingInfo ) */}
              <Controller
                name='fullName'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className='flex flex-row justify-between items-center'>
                      <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                      <span className='text-muted-foreground text-sm'>
                        For billing info
                      </span>
                    </div>
                    <Input
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder='Update user full name for billing info'
                      className='input'
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
            </>
          )}

          {/* Avatar */}
          <Controller
            name='avatar'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                className='lg:col-span-2'
                data-invalid={fieldState.invalid}
              >
                <FieldLabel htmlFor={field.name}>Avatar</FieldLabel>
                <div className='flex flex-row items-center gap-4'>
                  <AvatarUpload
                    userImage={user.image}
                    onChange={field.onChange}
                  />
                  <span className='text-sm text-muted-foreground'>
                    Recommended size: 64x64px.{' '}
                    <span className='block mt-2'>Max size: 5MB.</span>
                  </span>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <Button
          className='cursor-pointer text-base'
          size={'lg'}
          type='submit'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Spinner className='size-6' /> Updating...
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
