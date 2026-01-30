'use client';

import {
  ArrowLeft,
  ChevronRightIcon,
  LogOutIcon,
  SettingsIcon,
} from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/app/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { toast } from 'react-hot-toast';
import { logoutUser } from '@/lib/actions/auth';
import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@/types';

const AdminUserDropdown = ({ user }: { user: User }) => {
  const { isMobile, setOpenMobile } = useSidebar();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const links = [
    {
      label: 'Settings',
      icon: SettingsIcon,
      href: '/admin-dashboard/settings',
    },
    { label: 'Back to Main Site', icon: ArrowLeft, href: '/' },
  ];

  const handleLogout = async () => {
    setOpenMobile(false);
    const res = await logoutUser();

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    router.push('/');
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer'
            >
              <Avatar className='size-8 rounded-full'>
                <Suspense
                  fallback={
                    <AvatarFallback className='rounded-full'>
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  }
                >
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={32}
                    height={32}
                  />
                </Suspense>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{user.name}</span>
                <span className='truncate text-xs'>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
              <ChevronRightIcon className='ml-auto size-4 transition-transform duration-200 max-lg:rotate-270 [[data-state=open]>&]:rotate-90 lg:[[data-state=open]>&]:-rotate-180' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={isMobile ? 8 : 16}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='size-8 rounded-full'>
                  <Suspense
                    fallback={
                      <AvatarFallback className='rounded-full'>
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    }
                  >
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={32}
                      height={32}
                    />
                  </Suspense>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{user.name}</span>
                  <span className='truncate text-xs'>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {links.map((link) => (
                <DropdownMenuItem
                  onClick={() => {
                    setOpen(false);
                    setOpenMobile(false);
                  }}
                  className='cursor-pointer'
                  key={link.label}
                >
                  <Link href={link.href} className='flex items-center gap-2'>
                    <link.icon />

                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className='cursor-pointer'>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default AdminUserDropdown;
