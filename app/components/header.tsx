'use client';

import { useEffect, useState } from 'react';
import {
  DesktopNavigation,
  MobileNavigation,
} from '@/app/components/navigation';
import { cn, convertToPlainObject } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import { auth } from '@/lib/auth';
import Stripe from 'stripe';
import ProfileDropdown from '@/app/components/shared/ProfileDropdown';
import NotificationMenu from '@/app/components/NotificationMenu';
import CouponBanner from '@/app/components/CouponBanner';

type HeaderProps = {
  session: typeof auth.$Infer.Session | null;
  activeCoupon: Stripe.Response<Stripe.ApiList<Stripe.Coupon>> | null;
  userToken?: string | null;
};

const Header = ({ session, activeCoupon, userToken }: HeaderProps) => {
  const navigationData = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Pricing',
      href: '/pricing',
    },
    {
      title: 'Courses',
      href: '/courses',
    },
    ...(session?.user && session.user.role === 'instructor'
      ? []
      : [{ href: '/teach', title: 'Become an Instructor' }]),
    {
      title: 'More',
      subtitle: 'Explore',
      contentClassName: '!w-130',
      items: [
        {
          title: 'About Us',
          href: '/about',
        },
        {
          title: 'Contact',
          href: '/contact',
        },
        {
          title: 'Terms & Conditions',
          href: '/terms',
        },
      ],
      imageSection: {
        img: '/images/nav-more-image.jpg',
      },
    },
  ];

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'bg-transparent fixed w-full z-50 transition-all duration-300',
        offset > 10 ? 'shadow-md bg-white/80 backdrop-blur-md' : '',
      )}
    >
      {activeCoupon && offset < 10 && (
        <CouponBanner
          activeCoupon={convertToPlainObject(activeCoupon.data[0])}
        />
      )}
      <div className='container flex items-center justify-between gap-6 px-4 sm:px-6 lg:px-8 h-17.5'>
        {/* Logo */}
        <div className='flex items-center gap-2'>
          <Image src='/images/logo.png' alt='Logo' width={30} height={30} />
          <span className='text-xl font-semibold'>{APP_NAME}</span>
        </div>

        {/* Navigation */}
        <DesktopNavigation
          navigationData={navigationData}
          className='max-lg:hidden'
        />

        <div className='flex gap-2 items-center'>
          {/* Notification Menu */}
          {session && session.user.role !== 'admin' && (
            <NotificationMenu
              session={session}
              userToken={userToken as string}
            />
          )}
          <ProfileDropdown session={session} />
          {/* Navigation for small screens */}
          <MobileNavigation navigationData={navigationData} />
        </div>
      </div>
    </header>
  );
};

export default Header;
