import ProfileDropdown from '@/app/components/shared/ProfileDropdown';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { Button } from '../ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

const AccountHeader = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className='z-20 border-b'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 lg:px-6 h-17.5'>
        {/* Back to Home */}
        <Button className='group' variant='ghost' asChild>
          <Link href='/'>
            <ArrowLeftIcon
              aria-hidden='true'
              className='-ms-1 group-hover:-translate-x-0.5 opacity-60 transition-transform'
              size={16}
            />
            Back to Home
          </Link>
        </Button>

        {/* User menu */}
        <div className='flex-1/5 md:flex-1/2 flex justify-end'>
          <ProfileDropdown session={session} />
        </div>
      </div>
    </header>
  );
};

export default AccountHeader;
