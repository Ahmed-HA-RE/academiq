'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { useMedia } from 'react-use';
import { ChevronRightIcon, CircleSmallIcon, MenuIcon } from 'lucide-react';

import { Button } from '@/app/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/app/components/ui/collapsible';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/app/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/app/components/ui/sheet';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';

type NavigationItem = {
  title: string;
  href: string;
  icon?: ReactNode;
  description?: string;
};

type ImageSection = {
  img: string;
  href?: string;
  title?: string;
  description?: string;
};

type Navigation = {
  title: string;
  contentClassName?: string;
} & (
  | {
      href: string;
      items?: never;
      subtitle?: never;
      imageSection?: never;
    }
  | {
      href?: never;
      subtitle?: never;
      items?: NavigationItem[];
      imageSection?: never;
    }
  | {
      href?: never;
      subtitle: string;
      items?: NavigationItem[];
      imageSection: ImageSection;
    }
);

// Helper component to render navigation items with icons/descriptions
const RichNavigationItem = ({ item }: { item: NavigationItem }) => (
  <NavigationMenuLink asChild className='flex gap-2 p-2'>
    <Link href={item.href}>
      <div className='flex items-start gap-3'>
        {item.icon && (
          <div className='bg-background [&_svg]:text-foreground! flex size-7 items-center justify-center rounded-sm border'>
            {item.icon}
          </div>
        )}
        <div className='flex-1 space-y-1'>
          <div className='text-popover-foreground text-sm font-medium'>
            {item.title}
          </div>
          {item.description && (
            <p className='text-muted-foreground line-clamp-2 text-sm'>
              {item.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  </NavigationMenuLink>
);

// Helper component to render simple navigation items
const SimpleNavigationItem = ({ item }: { item: NavigationItem }) => (
  <NavigationMenuItem asChild className='block rounded-md p-2'>
    <Link href={item.href}>{item.title}</Link>
  </NavigationMenuItem>
);

// Helper component to render the image section
const ImageSectionContent = ({
  imageSection,
}: {
  imageSection: ImageSection;
}) => (
  <div className='relative block h-full overflow-hidden rounded-md'>
    <Image
      width={0}
      height={0}
      sizes='100vw'
      fill
      src={imageSection.img}
      alt={'Navigation Image'}
      className='h-full w-full rounded-md object-cover'
    />
  </div>
);

const DesktopNavigation = ({
  navigationData,
  className,
}: {
  navigationData: Navigation[];
  className?: string;
}) => {
  const hasRichContent = (items?: NavigationItem[]) =>
    items?.some((item) => item.description || item.icon);

  return (
    <div className={cn('flex items-center', className)}>
      <NavigationMenu viewport={false}>
        <NavigationMenuList className='flex-wrap gap-0'>
          {navigationData.map((navItem) => {
            // Simple link (no dropdown)
            if (navItem.href) {
              return (
                <NavigationMenuItem key={navItem.title}>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'text-muted-foreground bg-transparent !px-3 !py-1.5 text-base! font-medium! shadow-none',
                    )}
                  >
                    <Link href={navItem.href}>{navItem.title}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            }

            // Dropdown with items
            const ItemComponent = hasRichContent(navItem.items)
              ? RichNavigationItem
              : SimpleNavigationItem;
            const spacing = hasRichContent(navItem.items)
              ? 'space-y-2'
              : 'space-y-0.5';

            return (
              <NavigationMenuItem key={navItem.title}>
                <NavigationMenuTrigger className='text-muted-foreground bg-transparent !px-3 !py-1.5 text-base! font-medium! shadow-none [&_svg]:size-4'>
                  {navItem.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent
                  className={cn(
                    navItem.contentClassName,
                    'left-1/2 -translate-x-1/2 !bg-white/35 shadow-lg! !backdrop-blur-sm',
                  )}
                >
                  {navItem.imageSection ? (
                    <div className='grid grid-cols-2 gap-2'>
                      <ul className='bg-background space-y-2 rounded-md border p-2'>
                        <li className='text-muted-foreground px-2 text-sm'>
                          {navItem.subtitle}
                        </li>
                        {navItem.items?.map((item) => (
                          <li key={item.title}>
                            <RichNavigationItem item={item} />
                          </li>
                        ))}
                      </ul>
                      <div className='relative flex h-full flex-col overflow-hidden'>
                        <div className='flex-1'>
                          <ImageSectionContent
                            imageSection={navItem.imageSection}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ul
                      className={cn(
                        'bg-background rounded-md border p-2',
                        spacing,
                      )}
                    >
                      {navItem.items?.map((item) => (
                        <li key={item.title}>
                          <ItemComponent item={item} />
                        </li>
                      ))}
                    </ul>
                  )}
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

const MobileNavigation = ({
  navigationData,
  triggerClassName,
  screenSize = 1023,
}: {
  navigationData: Navigation[];
  triggerClassName?: string;
  screenSize?: number;
}) => {
  const [open, setOpen] = useState(false);
  const isMobile = useMedia(`(max-width: ${screenSize}px)`, false);

  const handleLinkClick = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!isMobile) {
      // ignore eslint-disable-next-line react-hooks/exhaustive-deps
      setOpen(false);
    }
  }, [isMobile]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className={cn(
            'inline-flex lg:hidden cursor-pointer bg-0 border-0 shadow-none outline-none focus:outline-none focus:ring-0 ',
            triggerClassName,
          )}
        >
          <MenuIcon />
          <span className='sr-only'>Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='w-75 gap-0 p-0'>
        <SheetHeader className='p-4'>
          <SheetTitle hidden />
          <SheetDescription hidden />
          <div className='flex gap-2 items-center'>
            <Image src='/images/logo.png' alt='Logo' width={30} height={30} />
            <span className='text-xl font-semibold'>{APP_NAME}</span>
          </div>
        </SheetHeader>
        <div className='space-y-0.5 overflow-y-auto p-2'>
          {navigationData.map((navItem, index) => {
            if (navItem.href) {
              return (
                <Link
                  key={navItem.title}
                  href={navItem.href}
                  className='hover:bg-accent flex items-center gap-2 rounded-sm px-3 py-2 text-sm'
                  onClick={handleLinkClick}
                >
                  {navItem.title}
                </Link>
              );
            }

            return (
              <Collapsible key={index} className='w-full'>
                <CollapsibleTrigger className='hover:bg-accent group flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm'>
                  <div className='flex items-center gap-2'>{navItem.title}</div>
                  <ChevronRightIcon className='size-4 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-90' />
                </CollapsibleTrigger>
                <CollapsibleContent className='data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden transition-all duration-300'>
                  {navItem.items?.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className='hover:bg-accent ml-2 flex items-center gap-2 rounded-sm px-3 py-2 text-sm'
                      onClick={handleLinkClick}
                    >
                      {item.icon ? (
                        item.icon
                      ) : (
                        <CircleSmallIcon className='size-4' />
                      )}
                      {item.title}
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export {
  DesktopNavigation,
  MobileNavigation,
  type Navigation,
  type NavigationItem,
  type ImageSection,
};
