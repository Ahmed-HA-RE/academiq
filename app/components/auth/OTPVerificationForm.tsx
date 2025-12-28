'use client';

import { Button } from '../ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '../../components/ui/input-otp';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VerifyOTPFormData } from '@/types';
import { verifyOTPSchema } from '@/schema';
import { Field, FieldError } from '../ui/field';
import { sendEmailVerificationOTP, verifyEmail } from '@/lib/actions/auth';
import { toast } from 'sonner';
import { Spinner } from '../ui/spinner';
import { useRouter } from 'next/navigation';
import ScreenSpinner from '../ScreenSpinner';
import { useTransition } from 'react';

const OTPVerificationForm = ({ callbackUrl }: { callbackUrl: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<VerifyOTPFormData>({
    resolver: zodResolver(verifyOTPSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: VerifyOTPFormData) => {
    const res = await verifyEmail(data.code);

    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message);
    router.push(callbackUrl);
  };

  const handleResend = async () => {
    startTransition(async () => {
      const res = await sendEmailVerificationOTP();

      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
    });
  };

  return (
    <>
      {isPending && <ScreenSpinner mutate={true} text='Sending...' />}
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <p className='text-muted-foreground text-center'>
          Type your 6 digit security code
        </p>

        <Controller
          control={form.control}
          name='code'
          render={({ field, fieldState }) => (
            <Field className='gap-4' data-invalid={fieldState.invalid}>
              <InputOTP id='recoveryCode' maxLength={6} {...field}>
                <InputOTPGroup className='w-full justify-center gap-4 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border'>
                  <InputOTPSlot aria-invalid={fieldState.invalid} index={0} />
                  <InputOTPSlot aria-invalid={fieldState.invalid} index={1} />
                  <InputOTPSlot aria-invalid={fieldState.invalid} index={2} />
                  <InputOTPSlot aria-invalid={fieldState.invalid} index={3} />
                  <InputOTPSlot aria-invalid={fieldState.invalid} index={4} />
                  <InputOTPSlot aria-invalid={fieldState.invalid} index={5} />
                </InputOTPGroup>
              </InputOTP>
              {fieldState.invalid && (
                <FieldError
                  className='text-center'
                  errors={[fieldState.error]}
                />
              )}
            </Field>
          )}
        />

        <Button
          className='w-full cursor-pointer'
          type='submit'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Spinner className='size-6' />
          ) : (
            'Submit'
          )}
        </Button>
        <p className='text-muted-foreground text-center text-sm'>
          Didn&apos;t receive the code?{' '}
          <Button
            onClick={handleResend}
            className='p-0 text-sm cursor-pointer'
            variant='link'
            type='button'
          >
            Resend
          </Button>
        </p>
      </form>
    </>
  );
};

export default OTPVerificationForm;
