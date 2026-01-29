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
      <NavigationMenuList>
        {navigationData.map((menu) => (
          <NavigationMenuItem key={menu.title}>
            <NavigationMenuLink
              href={menu.href}
              className={cn(
                `${navigationMenuTriggerStyle()}`,
                'hover:bg-0',
                'focus:bg-0',
                'text-muted-foreground',
                'text-lg',
                pathname === menu.href
                  ? 'text-black dark:text-white font-bold'
                  : 'font-normal hover:text-black dark:hover:text-white',
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
