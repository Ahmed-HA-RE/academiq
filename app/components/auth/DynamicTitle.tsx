'use client';
import { usePathname } from 'next/navigation';

const DynamicTitle = () => {
  const pathname = usePathname();

  let title = 'Welcome back';

  if (pathname === '/register') {
    title = 'Create account';
  } else if (pathname === '/verify-email') {
    title = 'Verify email';
  } else if (pathname === '/forgot-password') {
    title = 'Forgot password?';
  } else if (pathname === '/reset-password') {
    title = 'Reset password';
  }

  return (
    <h2 className='font-bold text-3xl md:text-4xl w-full text-center'>
      {title}
    </h2>
  );
};

export default DynamicTitle;
