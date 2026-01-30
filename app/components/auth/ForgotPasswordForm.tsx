'use client';
import { useForm, Controller } from 'react-hook-form';
import { FieldGroup, Field, FieldError, FieldLabel } from '../ui/field';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { Spinner } from '../ui/spinner';
import { useRouter } from 'next/navigation';
import { forgotPasswordSchema } from '@/schema';
import { ForgotPasswordFormData } from '@/types';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { sendPasswordResetLink } from '@/lib/actions/auth';
const ForgotPasswordForm = () => {
  const router = useRouter();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const res = await sendPasswordResetLink(data.email);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    setTimeout(() => router.push(`/login`), 1500);
  };

  return (
    <form className='mt-4' onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className='gap-6'>
        <Controller
          name='email'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
              <Input
                aria-invalid={fieldState.invalid}
                placeholder='Enter your email'
                className='input'
                {...field}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
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
            'Verify'
          )}
        </Button>
      </FieldGroup>
    </form>
  );
};

export default ForgotPasswordForm;
