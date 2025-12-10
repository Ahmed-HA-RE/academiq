'use client';

import Error02Illustration from '@/public/svg/error-02-illustration';
import { Button } from './components/ui/button';
import Link from 'next/link';

const ErrorPage = ({ error }: { error: Error }) => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-12 px-8 py-8 sm:py-16 lg:py-24'>
      <Error02Illustration className='h-[clamp(300px,50vh,500px)] max-sm:h-75' />

      <div className='text-center'>
        <h3 className='mb-6 text-5xl font-semibold'>Oops!</h3>
        <h4 className='mb-1.5 text-3xl font-semibold'>Something went wrong</h4>
        <p className='mb-6'>{error.message}</p>
        <Button size='lg' className='rounded-lg text-base' asChild>
          <Link href='/'>Back to home page</Link>
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
