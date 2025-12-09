'use client';

import Link from 'next/link';
import AuthLines from '../components/auth/auth-lines';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { ArrowLeftIcon } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { FaMicrosoft } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { sendEmailVerificationOTP } from '@/lib/actions/auth';
import { useTransition } from 'react';
import { toast } from 'sonner';
import ScreenSpinner from '../components/ScreenSpinner';

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  let title = 'Welcome back';
  let description: string = 'Please sign in to your account to continue.';

  if (pathname === '/register') {
    title = 'Create an account';
    description = 'Please enter your credentials to create a new account.';
  } else if (pathname === '/verify-email') {
    title = 'Verify your email';
    description = 'Please enter the verification code sent to your email.';
  }

  const handleResend = () => {
    startTransition(async () => {
      if (pathname === '/verify-email') {
        const res = await sendEmailVerificationOTP();

        if (!res.success) {
          toast.error(res.message);
          return;
        }
        toast.success(res.message);
      }
    });
  };

  return (
    <>
      {isPending && <ScreenSpinner mutate />}
      <div className='bg-muted flex h-auto min-h-screen items-center justify-center px-4 py-12 relative'>
        <Card className='relative w-full max-w-md overflow-hidden border-none pt-8 gap-3 shadow-lg'>
          <div className='to-primary/10 pointer-events-none absolute top-0 h-52 w-full rounded-t-xl bg-gradient-to-t from-transparent'></div>

          <AuthLines className='pointer-events-none absolute inset-0 top-0' />

          <CardHeader className='justify-center gap-5 text-center'>
            <div className='flex flex-row items-center justify-center gap-1'>
              <Image
                src={'/images/logo.png'}
                alt='Logo'
                width={35}
                height={35}
              />
              <span className='font-bold text-xl'>{APP_NAME}</span>
            </div>
            <div>
              <CardTitle className='mb-1.5 text-2xl'>{title}</CardTitle>
              <CardDescription className='text-base'>
                {description}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            {pathname === '/login' || pathname === '/register' ? (
              <>
                <div className='mb-6 flex items-center gap-2.5'>
                  <Button variant='outline' className='grow cursor-pointer'>
                    <FaMicrosoft aria-hidden='true' size={16} />
                    Login with Microsoft
                  </Button>
                  <Button variant='outline' className='grow cursor-pointer'>
                    <FcGoogle aria-hidden='true' size={16} />
                    Login with Google
                  </Button>
                </div>

                <div className='mb-2 flex items-center gap-4'>
                  <Separator className='flex-1' />
                  <p>or</p>
                  <Separator className='flex-1' />
                </div>
              </>
            ) : null}

            {children}
          </CardContent>
          {pathname === '/verify-email' || pathname === '/reset-password' ? (
            <CardFooter className='items-center justify-center'>
              <p className='text-muted-foreground'>
                Didn&apos;t receive the code?{' '}
                <Button
                  onClick={handleResend}
                  className='p-0 text-base cursor-pointer'
                  variant='link'
                >
                  Resend
                </Button>
              </p>
            </CardFooter>
          ) : null}
        </Card>
        <Button variant='ghost' className='group absolute top-4 left-4' asChild>
          <Link href={'/'}>
            <ArrowLeftIcon className='transition-transform duration-200 group-hover:-translate-x-0.5' />
            Back to Home
          </Link>
        </Button>
      </div>
    </>
  );
};

export default AuthLayout;
