'use client';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spinner } from '../ui/spinner';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { RegisterFormData } from '@/types';
import { registerSchema } from '@/schema';
import Link from 'next/link';
import { registerUser, signInWithProviders } from '@/lib/actions/auth';
import { SERVER_URL } from '@/lib/constants';
import { Separator } from '../ui/separator';
import { FcGoogle } from 'react-icons/fc';
import { useTransition } from 'react';
import ScreenSpinner from '../ScreenSpinner';
import { FaGithub } from 'react-icons/fa';

const RegisterForm = ({ callbackUrl }: { callbackUrl: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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
    setTimeout(() => router.push(`${SERVER_URL}/verify-email`), 1500);
  };

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    startTransition(async () => {
      const res = await signInWithProviders(provider, callbackUrl);
      if (res && res.success) {
        router.push(res.url);
      }
    });
  };

  return (
    <>
      {isPending && <ScreenSpinner mutate={true} text='Processing...' />}
      <form className='space-y-4 w-full' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-col items-center gap-3'>
          <Button
            className='bg-transparent border border-black text-black text-base hover:bg-0 cursor-pointer w-full'
            type='button'
            onClick={() => handleSocialSignIn('google')}
          >
            <span>
              <FcGoogle aria-hidden='true' />
            </span>
            Login with Google
          </Button>
          <Button
            className='bg-transparent border border-black text-black text-base hover:bg-0 cursor-pointer w-full'
            type='button'
            onClick={() => handleSocialSignIn('github')}
          >
            <span>
              <FaGithub aria-hidden='true' />
            </span>
            Login with Github
          </Button>
        </div>

        <div className='mb-2 flex items-center gap-4'>
          <Separator className='flex-1 bg-black' />
          <p className='text-black'>or</p>
          <Separator className='flex-1 bg-black' />
        </div>
        <FieldGroup className='gap-5'>
          {/* Name */}
          <Controller
            name='name'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  className='leading-5 text-black'
                  htmlFor={field.name}
                >
                  Full Name
                </FieldLabel>
                <Input
                  type='text'
                  id={field.name}
                  placeholder='Enter your full name'
                  aria-invalid={fieldState.invalid}
                  className='input text-black border-black'
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
                <FieldLabel
                  className='leading-5 text-black'
                  htmlFor={field.name}
                >
                  Email address
                </FieldLabel>
                <Input
                  type='email'
                  id={field.name}
                  placeholder='Enter your email address'
                  aria-invalid={fieldState.invalid}
                  className='input border-black text-black'
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* Password */}
          <Controller
            name='password'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  className='leading-5 text-black'
                  htmlFor={field.name}
                >
                  Password
                </FieldLabel>
                <Input
                  type='password'
                  id={field.name}
                  placeholder='Enter your password'
                  aria-invalid={fieldState.invalid}
                  className='input border-black text-black pr-9'
                  {...field}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* Confirm Password */}
          <Controller
            name='confirmPassword'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  className='leading-5 text-black'
                  htmlFor={field.name}
                >
                  Confirm Password
                </FieldLabel>
                <Input
                  type='password'
                  id={field.name}
                  placeholder='Enter your password'
                  aria-invalid={fieldState.invalid}
                  className='input border-black text-black pr-9'
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
            className='w-full cursor-pointer bg-primary hover:bg-primary-hover text-primary-foreground'
            type='submit'
          >
            {form.formState.isSubmitting ? (
              <Spinner className='size-6' />
            ) : (
              'Register'
            )}
          </Button>
          <p className='text-black text-center'>
            Already have an account?{' '}
            <Link
              href={
                callbackUrl ? `/login?callbackUrl=${callbackUrl}` : '/login'
              }
              className='text-primary hover:underline'
            >
              Login
            </Link>
          </p>
        </FieldGroup>
      </form>
    </>
  );
};

export default RegisterForm;
