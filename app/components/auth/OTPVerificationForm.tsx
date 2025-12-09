'use client';

import { Button } from '../ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '../../components/ui/input-otp';

const OTPVerificationForm = ({ type }: { type: 'email' | 'password' }) => {
  return (
    <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
      <p className='text-muted-foreground text-center'>
        Type your 6 digit security code
      </p>

      <InputOTP id='recoveryCode' maxLength={6}>
        <InputOTPGroup className='w-full justify-center gap-4 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border'>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <Button className='w-full' type='submit'>
        Submit
      </Button>
    </form>
  );
};

export default OTPVerificationForm;
