import ProfileDropdown from '@/app/components/shared/ProfileDropdown';
import MenuSheet from './MenuSheet';
import Link from 'next/link';
import Image from 'next/image';
import DesktopNavMenu from './DesktopNavMenu';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { APP_NAME } from '@/lib/constants';
import NotificationMenu from '../NotificationMenu';
import { signUserSecureToken } from '@/lib/knock';
import stripe from '@/lib/stripe';
import CouponBanner from '../CouponBanner';
import { convertToPlainObject } from '@/lib/utils';

const Header = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let userToken;

  if (session) {
    userToken = await signUserSecureToken(session.user.id);
  }

  const activeCoupon = await stripe.coupons.list({
    limit: 1,
  });

  const baseNavigationMenu = [
    { href: '/courses', title: 'Courses' },
    ...(session?.user && session.user.role === 'instructor'
      ? []
      : [{ href: '/teach', title: 'Become an Instructor' }]),
    { href: '/pricing', title: 'Pricing' },
    { href: '/about', title: 'About' },
    { href: '/contact', title: 'Contact' },
  ];

  return (
    <>
      {/* {activeCoupon && (
        <CouponBanner
          activeCoupon={convertToPlainObject(activeCoupon.data[0])}
        />
      )} */}
      <header className='absolute top-0 left-0 w-full z-20 '>
        <div className='container flex items-center justify-between gap-4 h-17.5'>
          <div className='flex items-center lg:gap-10'>
            <MenuSheet navigationData={baseNavigationMenu} />
            <Link className='flex flex-row items-center gap-1' href='/'>
              <Image
                src={'/images/logo.png'}
                alt='Logo'
                width={30}
                height={30}
              />
              <span className='font-bold text-lg text-primary'>{APP_NAME}</span>
            </Link>
          </div>
          <DesktopNavMenu navigationData={baseNavigationMenu} />

          <div className='flex items-center gap-2'>
            {/* Notification Menu */}
            {session && session.user.role !== 'admin' && (
              <NotificationMenu
                session={session}
                userToken={userToken as string}
              />
            )}
            {/* User menu */}
            <ProfileDropdown session={session} />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
