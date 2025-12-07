'use client';

import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '../ui/navigation-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type DesktopNavMenuProps = {
  navigationData: { title: string; href: string }[];
};

const DesktopNavMenu = ({ navigationData }: DesktopNavMenuProps) => {
  const pathname = usePathname();

  return (
    <NavigationMenu viewport={false} className='hidden lg:block'>
      <NavigationMenuList className=''>
        {navigationData.map((menu) => (
          <NavigationMenuItem key={menu.title} className=''>
            <NavigationMenuLink
              href={menu.href}
              className={cn(
                `${navigationMenuTriggerStyle()}`,
                'hover:bg-0',
                'focus:bg-0',
                'font-normal',
                pathname !== menu.href ? 'link-affect' : 'font-bold'
              )}
              asChild
            >
              <Link href={menu.href}>{menu.title}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNavMenu;
