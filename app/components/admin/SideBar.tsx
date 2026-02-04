'use client';
import { Suspense } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '../ui/sidebar';
import Image from 'next/image';
import {
  Banknote,
  Box,
  ChevronRightIcon,
  Contact,
  FileUser,
  HomeIcon,
  TvMinimalPlay,
  UsersIcon,
} from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '../ui/avatar';
import AdminUserDropdown from './AdminUserDropdown';
import { User } from '@/types';
import { useSidebar } from '../ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';

const pagesItems = [
  {
    icon: HomeIcon,
    label: 'Home',
    href: '/admin-dashboard',
  },
  {
    icon: TvMinimalPlay,
    label: 'Courses',
    href: '/admin-dashboard/courses',
  },
  {
    icon: Contact,
    label: 'Instructors',
    href: '/admin-dashboard/instructors',
  },
  {
    icon: FileUser,
    label: 'Applications',
    href: '/admin-dashboard/applications',
  },
  {
    icon: UsersIcon,
    label: 'Users Management',
    items: [
      { label: 'All Users', href: '/admin-dashboard/users' },
      { label: 'Admins', href: '/admin-dashboard/users/admins' },
      { label: 'Subscribers', href: '/admin-dashboard/users/subscribers' },
      { label: 'Banned Users', href: '/admin-dashboard/users/banned-users' },
    ],
  },
  {
    icon: Box,
    label: 'Orders',
    href: '/admin-dashboard/orders',
  },
  {
    icon: Banknote,
    label: 'Discounts',
    href: '/admin-dashboard/discounts',
  },
];

const SideBar = ({ user, admins }: { user: User; admins: User[] }) => {
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar
      variant='floating'
      collapsible='icon'
      className='p-6 pr-0 [&>[data-slot=sidebar-inner]]:group-data-[variant=floating]:rounded-xl z-1'
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              className='gap-2.5 !bg-transparent [&>svg]:size-8'
            >
              <Image src='/images/logo.png' alt='Logo' width={32} height={32} />
              <span className='text-xl font-semibold'>{APP_NAME}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {pagesItems.map((item) =>
                item.items ? (
                  <Collapsible className='group/collapsible' key={item.label}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.label}
                          className='truncate'
                        >
                          <item.icon />
                          <span>{item.label}</span>
                          <ChevronRightIcon className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.label}>
                              <SidebarMenuSubButton
                                className='justify-between'
                                asChild
                                onClick={() => setOpenMobile(false)}
                              >
                                <Link href={subItem.href}>{subItem.label}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem
                    onClick={() => setOpenMobile(false)}
                    key={item.label}
                  >
                    <SidebarMenuButton tooltip={item.label} asChild>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Admins</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className='space-y-2'>
              {admins.map((admin) => (
                <SidebarMenuItem
                  className='flex items-center gap-2 px-1 cursor-default'
                  key={admin.id}
                >
                  <Avatar className='size-7 rounded-full'>
                    <Suspense
                      fallback={
                        <AvatarFallback className='rounded-full'>
                          {admin.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      }
                    >
                      <Image
                        src={admin.image}
                        alt={admin.name}
                        width={28}
                        height={28}
                        className='object-cover'
                      />
                    </Suspense>
                  </Avatar>
                  <span>{admin.name}</span>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* Admin User Dropdown */}
        <AdminUserDropdown user={user} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideBar;
