'use client';

import { useEffect, useState } from 'react';

import { useMedia } from 'react-use';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '../ui/sheet';
import { Button } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MenuIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type MenuSheetProps = {
  logoName: string;
  navigationData: { title: string; href: string }[];
};

const MenuSheet = ({ logoName, navigationData }: MenuSheetProps) => {
  const [open, setOpen] = useState(false);
  const isMobile = useMedia('(max-width: 767px)', false);
  const pathname = usePathname();

  const handleLinkClick = () => {
    setOpen(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='inline-flex lg:hidden text-black dark:text-white cursor-pointer'
        >
          <MenuIcon />
          <span className='sr-only'>Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='w-75 gap-0 p-0'>
        <SheetHeader className='p-4'>
          <SheetTitle hidden />
          <SheetDescription hidden />
          <Link
            href='/'
            onClick={handleLinkClick}
            className='self-start flex items-center mt-4'
          >
            <Image src={'/images/logo.png'} alt='Logo' width={30} height={30} />
            <span className='ml-2.5 text-xl font-semibold'>{logoName}</span>
          </Link>
        </SheetHeader>
        <div className='overflow-y-auto space-y-2'>
          {navigationData.map((navItem) => (
            <Link
              key={navItem.title}
              href={navItem.href}
              className={cn(
                'hover:bg-accent flex',
                'items-center',
                'duration-300',
                'hover:bg-blue-50',
                'gap-2',
                'px-4',
                'py-2',
                'text-sm',
                pathname === navItem.href &&
                  'bg-blue-50 dark:bg-blue-100 text-black hover:bg-0'
              )}
              onClick={handleLinkClick}
            >
              {navItem.title}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuSheet;
