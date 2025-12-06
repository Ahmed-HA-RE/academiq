'use client';

import {
  UserIcon,
  SettingsIcon,
  ShieldUser,
  LibraryBig,
  LogOutIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/app/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { useState } from 'react';
import Link from 'next/link';

type User = {
  role: 'admin' | 'user';
  status: 'online' | 'offline';
};

const ProfileDropdown = () => {
  const fakeUser: User = {
    role: 'admin',
    status: 'offline',
  };
  const [user, setUser] = useState<User | null>(null);

  const adminLinks =
    user?.role === 'admin'
      ? [{ icon: ShieldUser, title: 'Admin Dashboard', href: '/admin' }]
      : [];

  const userLinks = [
    { icon: UserIcon, title: 'My account', href: '/account' },
    { icon: SettingsIcon, title: 'Settings', href: '/settings' },
    { icon: LibraryBig, title: 'My Courses', href: '/my-courses' },
  ];

  const links = [...userLinks, ...adminLinks];

  return !user ? (
    <Button className='btn-hover-affect' asChild>
      <Link href='/login'>Login</Link>
    </Button>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='h-full gap-3 p-0 hover:bg-transparent dark:hover:bg-transparent focus-visible:ring-0 sm:pr-1 cursor-pointer'
        >
          <Avatar className='size-9 rounded-full'>
            <AvatarImage src='' />
            <AvatarFallback>AH</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-75' align={'end'}>
        <DropdownMenuLabel className='flex items-center gap-4 px-4 py-2.5 font-normal'>
          <div className='relative'>
            <Avatar className='size-10'>
              <AvatarImage
                src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png'
                alt='John Doe'
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <span
              className={cn(
                'ring-card',
                'absolute',
                'right-0',
                'bottom-0',
                'block',
                'size-2',
                'rounded-full',
                user.status === 'online' ? 'bg-green-600' : 'bg-red-600',
                'ring-2'
              )}
            />
          </div>
          <div className='flex flex-1 flex-col items-start'>
            <span className='text-foreground text-lg font-semibold'>
              John Doe
            </span>
            <span className='text-muted-foreground text-base'>
              john.doe@example.com
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {links.map((link) => (
            <DropdownMenuItem
              key={link.title}
              className='px-4 py-2.5 text-base cursor-pointer'
              asChild
            >
              <Link href={link.href}>
                <link.icon className='text-foreground size-5' />
                <span>{link.title}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant='destructive'
          className='px-4 py-2.5 text-base'
        >
          <LogOutIcon className='size-5' />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
