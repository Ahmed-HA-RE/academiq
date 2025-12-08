import Link from 'next/link';
import AuthLines from '../components/auth/auth-lines';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import Image from 'next/image';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { ArrowLeftIcon } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-muted flex h-auto min-h-screen items-center justify-center px-4 py-10 relative'>
      <Card className='relative w-full max-w-md overflow-hidden border-none pt-12 shadow-lg'>
        <div className='to-primary/10 pointer-events-none absolute top-0 h-52 w-full rounded-t-xl bg-gradient-to-t from-transparent'></div>

        <AuthLines className='pointer-events-none absolute inset-x-0 top-0' />

        <CardHeader className='justify-center gap-5 text-center'>
          <Link
            className='flex flex-row items-center justify-center gap-1'
            href='/'
          >
            <Image src={'/images/logo.png'} alt='Logo' width={35} height={35} />
            <span className='font-bold text-xl'>{APP_NAME}</span>
          </Link>
          <div>
            <CardTitle className='mb-1.5 text-2xl'>Welcome Back</CardTitle>
            <CardDescription className='text-base'>
              Please enter your credentials to sign in
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <div className='mb-6 flex items-center gap-2.5'>
            <Button variant='outline' className='grow' asChild>
              <Image
                src={'/images/google.png'}
                alt='Google'
                width={35}
                height={35}
                className='object-contain'
              />
            </Button>
            <Button variant='outline' className='grow' asChild>
              <Image
                src={'/images/microsoft.png'}
                alt='Microsoft'
                width={35}
                height={35}
                className='object-contain'
              />
            </Button>
          </div>

          <div className='mb-6 flex items-center gap-4'>
            <Separator className='flex-1' />
            <p>or</p>
            <Separator className='flex-1' />
          </div>

          {children}

          <p className='text-muted-foreground mt-4 text-center'>
            New on our platform?{' '}
            <Link
              href='/register'
              className='text-card-foreground hover:underline'
            >
              Create an account
            </Link>
          </p>
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
