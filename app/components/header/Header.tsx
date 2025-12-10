import ProfileDropdown from '@/app/components/header/ProfileDropdown';
import MenuSheet from './MenuSheet';
import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';
import Image from 'next/image';
import DesktopNavMenu from './DesktopNavMenu';
import Theme from '../Theme';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getMyCart } from '@/lib/actions/cart';
import CartSheet from '../Cart';

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

  const cart = await getMyCart();

  return (
    <header className='bg-transparent z-10'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-7 lg:px-6'>
        <div className='flex items-center lg:gap-10'>
          <MenuSheet navigationData={baseNavigationMenu} logoName={APP_NAME} />
          <Link className='flex flex-row items-center gap-1' href='/'>
            <Image src={'/images/logo.png'} alt='Logo' width={30} height={30} />
            <span className='font-bold'>{APP_NAME}</span>
          </Link>
          <DesktopNavMenu navigationData={baseNavigationMenu} />
        </div>

        <div className='flex items-center '>
          {/* Cart */}
          <CartSheet cart={cart} />
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
