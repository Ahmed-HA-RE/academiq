import ProfileDropdown from '@/app/components/shared/ProfileDropdown';
import MenuSheet from './MenuSheet';
import Link from 'next/link';
import Image from 'next/image';
import DesktopNavMenu from './DesktopNavMenu';
import Theme from '../Theme';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { APP_NAME } from '@/lib/constants';
import { ShoppingCartIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const Header = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const baseNavigationMenu = [
    { href: '/courses', title: 'Courses' },
    { href: '/prices', title: 'Prices' },
    { href: '/about', title: 'About' },
    ...(session?.user && session.user.role === 'instructor'
      ? []
      : [{ href: '/teach', title: 'Become an Instructor' }]),
    { href: '/contact', title: 'Contact' },
  ];

  return (
    <header className='bg-transparent z-20 border-b'>
      <div className='mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 lg:px-6 h-17.5'>
        <div className='flex items-center lg:gap-10'>
          <MenuSheet navigationData={baseNavigationMenu} />
          <Link className='flex flex-row items-center gap-1' href='/'>
            <Image src={'/images/logo.png'} alt='Logo' width={40} height={40} />
            <span className='font-medium text-lg'>{APP_NAME}</span>
          </Link>
          <DesktopNavMenu navigationData={baseNavigationMenu} />
        </div>

        <div className='flex items-center'>
          {/* Cart */}
          {session?.user && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='relative w-fit cursor-pointer'>
                  <Link href='/cart'>
                    <Avatar className='size-9 rounded-sm'>
                      <AvatarFallback className='rounded-sm bg-0 hover:bg-accent dark:hover:bg-accent/80 transition'>
                        <ShoppingCartIcon className='size-5' />
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cart</p>
              </TooltipContent>
            </Tooltip>
          )}
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
