'use client';

import Link from 'next/link';
import AuthLines from '../components/auth/auth-lines';
import {
  Card,
  CardContent,
  CardDescription,
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

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();

  let title = 'Welcome back';
  let description: string = 'Please sign in to your account to continue.';

  if (pathname === '/register') {
    title = 'Create an account';
    description = 'Please enter your credentials to create a new account.';
  }

  return (
    <div className='bg-muted flex h-auto min-h-screen items-center justify-center px-4 py-10 relative'>
      <Card className='relative w-full max-w-md overflow-hidden border-none pt-12 shadow-lg'>
        <div className='to-primary/10 pointer-events-none absolute top-0 h-52 w-full rounded-t-xl bg-gradient-to-t from-transparent'></div>

        <AuthLines className='pointer-events-none absolute inset-x-0 top-0' />

        <CardHeader className='justify-center gap-5 text-center'>
          <div className='flex flex-row items-center justify-center gap-1'>
            <Image src={'/images/logo.png'} alt='Logo' width={35} height={35} />
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

          {children}
        </CardContent>
      </Card>
      <Button variant='ghost' className='group absolute top-4 left-4' asChild>
        <Link href={'/'}>
          <ArrowLeftIcon className='transition-transform duration-200 group-hover:-translate-x-0.5' />
          Back to Home
        </Link>
      </Button>
    </div>
  );
};

export default AuthLayout;
