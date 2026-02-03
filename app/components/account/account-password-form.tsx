'use client';

import { Button } from '../ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Card, CardContent } from '../ui/card';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '../ui/input';
import { UpdateAccountPassword } from '@/types';
import { updateAccountPasswordSchema } from '@/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateAccountPassword } from '@/lib/actions/user/update-user-account';
import toast from 'react-hot-toast';
import { useTransition } from 'react';
import { sendPasswordResetLink } from '@/lib/actions/auth';
import ScreenSpinner from '../ScreenSpinner';

const AccountPasswordForm = ({ userEmail }: { userEmail: string }) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateAccountPassword>({
    resolver: zodResolver(updateAccountPasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: UpdateAccountPassword) => {
    const res = await updateAccountPassword(data);
    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    form.reset();
  };

  const handleSendResetPassword = () => {
    startTransition(async () => {
      const res = await sendPasswordResetLink(userEmail);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
    });
  };

  return (
    <div className='w-full flex-1/2'>
      {isPending && <ScreenSpinner mutate={true} text='Sending...' />}
      <Card>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            <FieldGroup className='gap-5'>
              {/* Password */}
              <Controller
                name='currentPassword'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className='flex flex-row justify-between items-center'>
                      <FieldLabel className='leading-5' htmlFor={field.name}>
                        Current Password
                      </FieldLabel>
                      <span
                        onClick={handleSendResetPassword}
                        className='text-lime-500 dark:text-lime-600 cursor-pointer  underline underline-offset-2 text-sm'
                      >
                        Forgot?
                      </span>
                    </div>
                    <Input
                      type='password'
                      id={field.name}
                      placeholder='Enter your password'
                      aria-invalid={fieldState.invalid}
                      className='input pr-9'
                      {...field}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* New Password */}
              <Controller
                name='newPassword'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className='leading-5' htmlFor={field.name}>
                      New Password
                    </FieldLabel>
                    <Input
                      type='password'
                      id={field.name}
                      placeholder='Enter your password'
                      aria-invalid={fieldState.invalid}
                      className='input pr-9'
                      {...field}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Confirm New Password */}
              <Controller
                name='confirmNewPassword'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className='leading-5' htmlFor={field.name}>
                      Confirm New Password
                    </FieldLabel>
                    <Input
                      type='password'
                      id={field.name}
                      placeholder='Enter your password'
                      aria-invalid={fieldState.invalid}
                      className='input pr-9'
                      {...field}
                    />

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

export default AccountPasswordForm;
