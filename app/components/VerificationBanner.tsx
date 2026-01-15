'use client';

import { ArrowRightIcon, Mail } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const VerificationBanner = () => {
  const pathname = usePathname();

  return (
    <div className='dark bg-muted px-4 py-3 text-foreground'>
      <div className='flex flex-col justify-between gap-2 md:flex-row max-w-[1440px] mx-auto md:px-6'>
        <div className='flex grow gap-3'>
          <Mail
            aria-hidden='true'
            className='mt-0.5 shrink-0 opacity-60'
            size={16}
          />
          <div className='flex grow flex-col justify-between gap-2 md:flex-row md:items-center'>
            <p className='text-sm'>
              We just sent a verification email to your inbox. Please verify
              your email to access all features.
            </p>
            <Link
              className='group whitespace-nowrap font-medium text-sm'
              href={`/verify-email?callbackUrl=${pathname}`}
            >
              Verify
              <ArrowRightIcon
                aria-hidden='true'
                className='-mt-0.5 ms-1 inline-flex opacity-60 transition-transform group-hover:translate-x-0.5'
                size={16}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VerificationBanner;
