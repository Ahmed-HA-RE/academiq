'use client';
import { useForm, Controller } from 'react-hook-form';
import { FieldGroup, Field, FieldError, FieldLabel } from '../ui/field';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { Spinner } from '../ui/spinner';
import { useRouter } from 'next/navigation';
import { resetPasswordSchema } from '@/schema';
import { ResetPasswordFormData } from '@/types';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { authClient } from '@/lib/authClient';

const ResetPasswordForm = ({ token }: { token: string }) => {
  const router = useRouter();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    const { error } = await authClient.resetPassword({
      newPassword: data.newPassword,
      token,
    });
    toast.success('Password reset successfully');
    setTimeout(() => router.push('/login'), 1500);

    if (error && error.message) {
      toast.error(error.message);
      return;
    }
  };

  return (
    <form className='mt-4 w-full' onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className='gap-6'>
        {/* Password */}
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
                placeholder='Enter your new password'
                aria-invalid={fieldState.invalid}
                className='input pr-9'
                {...field}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* Confirm Password */}
        <Controller
          name='confirmPassword'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className='leading-5' htmlFor={field.name}>
                Confirm Password
              </FieldLabel>
              <Input
                type='password'
                id={field.name}
                placeholder='Confirm your password'
                aria-invalid={fieldState.invalid}
                className='input pr-9'
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          className='cursor-pointer'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Spinner className='size-6' />
          ) : (
            'Reset Password'
          )}
        </Button>
      </FieldGroup>
    </form>
  );
};

export default ResetPasswordForm;
