'use client';
import { usePathname } from 'next/navigation';
import { CardDescription, CardHeader, CardTitle } from '../ui/card';
import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';

const DynamicCardHeader = () => {
  const pathname = usePathname();

  let title = 'Welcome back';
  let description: string = 'Please sign in to your account to continue.';

  if (pathname === '/register') {
    title = 'Create an account';
    description = 'Please enter your credentials to create a new account.';
  } else if (pathname === '/verify-email') {
    title = 'Verify your email';
    description = 'Please enter the verification code sent to your email.';
  } else if (pathname === '/forgot-password') {
    title = 'Forgot your password?';
    description = 'Enter your email to receive a verification code.';
  } else if (pathname === '/reset-password') {
    title = 'Reset your password';
    description = 'Enter your new password to reset your current password.';
  }

  return (
    <CardHeader className='justify-center gap-1 text-center'>
      <Image
        src={'/images/logo.png'}
        alt='Logo'
        width={40}
        height={40}
        className='mx-auto'
      />
      <div>
        <CardTitle className='mb-1.5 text-2xl'>{title}</CardTitle>
        <CardDescription className='text-base'>{description}</CardDescription>
      </div>
    </CardHeader>
  );
};

export default DynamicCardHeader;
