'use client';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spinner } from '../ui/spinner';
import { toast } from 'sonner';
import { useSearchParams, useRouter } from 'next/navigation';
import { RegisterFormData } from '@/types';
import { registerSchema } from '@/schema';
import Link from 'next/link';
import { registerUser } from '@/lib/actions/auth';
import { SERVER_URL } from '@/lib/constants';

const RegisterForm = () => {
  const callbackUrl = useSearchParams().get('callbackUrl') || '/';
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: RegisterFormData) => {
    const res = await registerUser(data);

    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message);
    setTimeout(() => router.push(`${SERVER_URL}/login`), 1500);
  };

  return (
    <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* Password */}
        <Controller
          name='password'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className='leading-5' htmlFor={field.name}>
                Password
              </FieldLabel>
              <Input
                type='password'
                id={field.name}
                placeholder='Enter your password'
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
                placeholder='Enter your password'
                aria-invalid={fieldState.invalid}
                className='input pr-9'
                {...field}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          disabled={form.formState.isSubmitting}
          className='w-full cursor-pointer'
          type='submit'
        >
          {form.formState.isSubmitting ? (
            <Spinner className='size-6' />
          ) : (
            'Register'
          )}
        </Button>
        <p className='text-muted-foreground text-center'>
          Already have an account?{' '}
          <Link
            href={callbackUrl ? `/login?callbackUrl=${callbackUrl}` : '/login'}
            className='text-card-foreground hover:underline'
          >
            Login
          </Link>
        </p>
      </FieldGroup>
    </form>
  );
};

export default RegisterForm;
