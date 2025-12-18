import ProfileDropdown from '@/app/components/shared/ProfileDropdown';
import MenuSheet from '../header/MenuSheet';
import Link from 'next/link';
import Image from 'next/image';
import Theme from '../Theme';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { APP_NAME } from '@/lib/constants';
import Search from './Search';

const Header = async () => {
  const baseNavigationMenu = [
    { href: '/courses', title: 'Courses' },
    { href: '/prices', title: 'Prices' },
    { href: '/about', title: 'About ' },
    { href: '/contact', title: 'Contact ' },
  ];

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className='bg-transparent z-30'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-7 lg:px-6'>
        <Link
          className='flex flex-row items-center gap-1 flex-1/3 md:flex-1/2'
          href='/'
        >
          <Image src={'/images/logo.png'} alt='Logo' width={40} height={40} />
          <span className='font-bold text-lg'>{APP_NAME}</span>
        </Link>

        {/* Search Bar */}
        <Search />

        <div className='flex items-center flex-1/5 md:flex-1/2 justify-end '>
          {/* Theme */}
          <Theme />
          {/* User menu */}
          <ProfileDropdown session={session} />
        </div>
      </div>
    </header>
  );
};

export default Header;
