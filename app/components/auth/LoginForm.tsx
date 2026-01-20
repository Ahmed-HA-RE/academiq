'use client';

import { useState, useTransition } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Input } from '@/app/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spinner } from '../ui/spinner';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { LoginFormData } from '@/types';
import { loginSchema } from '@/schema';
import Link from 'next/link';
import { loginUser, signInWithProviders } from '@/lib/actions/auth';
import ScreenSpinner from '../ScreenSpinner';
import { FcGoogle } from 'react-icons/fc';

const LoginForm = ({ callbackUrl }: { callbackUrl: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: LoginFormData) => {
    const res = await loginUser(data);

    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message);
    router.push(callbackUrl);
  };

  const handleSocialSignIn = async (provider: 'google') => {
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
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='mb-4 flex items-center'>
          <Button
            className='bg-transparent border text-black dark:text-white text-base hover:dark:border-white/70 hover:border-black/50 hover:bg-0 cursor-pointer w-full'
            type='button'
            onClick={() => handleSocialSignIn('google')}
          >
            <span className=''>
              <FcGoogle aria-hidden='true' />
            </span>
            Login with Google
          </Button>
        </div>
        <FieldGroup className='gap-5'>
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name='password'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className='leading-5' htmlFor={field.name}>
                  Password
                </FieldLabel>
                <div className='relative'>
                  <Input
                    type={isVisible ? 'text' : 'password'}
                    id={field.name}
                    placeholder='Enter your password'
                    aria-invalid={fieldState.invalid}
                    className='input pr-9'
                    {...field}
                  />
                  <Button
                    variant='ghost'
                    size='icon'
                    type='button'
                    onClick={() => setIsVisible((prevState) => !prevState)}
                    className=' absolute inset-y-0 right-0 rounded-l-none hover:bg-0 dark:hover:bg-0 cursor-pointer'
                  >
                    {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                    <span className='sr-only'>
                      {isVisible ? 'Hide password' : 'Show password'}
                    </span>
                  </Button>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Remember Me and Forgot Password */}
          <div className='flex items-center justify-between gap-y-2'>
            <Controller
              name='rememberMe'
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldGroup className='w-40' data-slot='checkbox-group'>
                  <Field
                    orientation={'horizontal'}
                    className='items-start justify-start'
                    data-invalid={fieldState.invalid}
                  >
                    <Checkbox
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      className='input  size-5'
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel className='leading-5' htmlFor={field.name}>
                      Rememeber Me
                    </FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                </FieldGroup>
              )}
            />

            <Link
              href='/forgot-password'
              className='hover:underline text-sm text-right'
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            disabled={form.formState.isSubmitting}
            className='w-full cursor-pointer'
            type='submit'
          >
            {form.formState.isSubmitting ? (
              <Spinner className='size-6' />
            ) : (
              'Sign in'
            )}
          </Button>
          <p className='text-muted-foreground text-center'>
            Don&apos;t have an account?{' '}
            <Link
              href={
                callbackUrl
                  ? `/register?callbackUrl=${callbackUrl}`
                  : '/register'
              }
              className='text-card-foreground hover:underline'
            >
              Register
            </Link>
          </p>
        </FieldGroup>
      </form>
    </>
  );
};

export default LoginForm;
