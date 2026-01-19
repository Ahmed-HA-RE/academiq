'use client';

import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/app/components/ui/sidebar';
import Image from 'next/image';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { APP_NAME } from '@/lib/constants';
import { SidebarContent } from '@/app/components/ui/sidebar';
import {
  ArrowLeftFromLineIcon,
  FileBadge,
  HomeIcon,
  SettingsIcon,
  TvMinimalPlayIcon,
  Users2,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { useSidebar } from '@/app/components/ui/sidebar';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    icon: HomeIcon,
    label: 'Home',
    href: '/instructor-dashboard',
  },
  {
    icon: TvMinimalPlayIcon,
    label: 'Courses',
    href: '/instructor-dashboard/courses',
  },
  {
    icon: Users2,
    label: 'Students',
    href: '/instructor-dashboard/students',
  },
  {
    icon: FileBadge,
    label: 'Certificates',
    href: '/instructor-dashboard/certificates',
  },
  {
    icon: SettingsIcon,
    label: 'Settings',
    href: '/instructor-dashboard/settings',
  },
  {
    icon: Wallet,
    label: 'Payments',
    href: '/instructor-dashboard/payments',
  },
  {
    icon: ArrowLeftFromLineIcon,
    label: 'Main Site',
    href: '/',
  },
];

const SidebarGroupedMenuItems = () => {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup className='mt-2'>
      <p className='[[data-state=collapsed]_&]:hidden text-muted-foreground text-sm font-medium px-2 mb-2'>
        Pages
      </p>
      <SidebarGroupContent>
        <SidebarMenu className='[[data-state=collapsed]_&]:gap-4 gap-2 '>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                className={cn(
                  `[[data-state=collapsed]_&>span:last-child]:overflow-unset [[data-state=collapsed]_&>span:last-child]:[text-overflow=unset] [[data-state=collapsed]_&]:h-auto! [[data-state=collapsed]_&]:w-15! [[data-state=collapsed]_&]:flex-col [[data-state=collapsed]_&]:gap-2.5! [[data-state=collapsed]_&>span:last-child]:text-xs [[data-state=collapsed]_&>svg]:size-5!`,
                  item.href === '/' && 'self-end h-full'
                )}
                asChild
              >
                <Link onClick={() => setOpenMobile(false)} href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>

              {item.icon && (
                <SidebarMenuBadge className='bg-primary/10 rounded-full hidden'>
                  <item.icon />
                </SidebarMenuBadge>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

const SideBar = () => {
  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader className='pt-4'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              className='gap-2.5 !bg-transparent [&>svg]:size-8 mx-auto'
            >
              <Image src='/images/logo.png' alt='Logo' width={32} height={32} />
              <span className='text-xl font-semibold'>{APP_NAME}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <ScrollArea className='h-[calc(100dvh-4rem)] [[data-state=collapsed]_&]:h-[calc(100dvh-3.375rem)]'>
        <SidebarContent>
          <SidebarGroupedMenuItems />
        </SidebarContent>
      </ScrollArea>
      <SidebarRail />
    </Sidebar>
  );
};

export default SideBar;
