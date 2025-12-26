'use client';

import {
  UserIcon,
  SettingsIcon,
  ShieldUser,
  LibraryBig,
  LogOutIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
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
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Suspense } from 'react';
import Image from 'next/image';
import { logoutUser } from '@/lib/actions/auth';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import ScreenSpinner from '../ScreenSpinner';

const ProfileDropdown = ({
  session,
}: {
  session: typeof auth.$Infer.Session | null;
}) => {
  const adminLinks =
    session && session.user.role === 'admin'
      ? [
          {
            icon: ShieldUser,
            title: 'Admin Dashboard',
            href: '/admin-dashboard',
          },
        ]
      : [];

  const userLinks = [
    { icon: UserIcon, title: 'My account', href: '/account' },
    { icon: SettingsIcon, title: 'Settings', href: '/settings' },
    { icon: LibraryBig, title: 'My Courses', href: '/my-courses' },
  ];

  const links = [...userLinks, ...adminLinks];

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startTransition(async () => {
      const res = await logoutUser();

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      router.push('/');
    });
  };

  return !session ? (
    <Button className='btn-hover-affect' asChild>
      <Link href='/login'>Login</Link>
    </Button>
  ) : (
    <>
      {isPending && <ScreenSpinner mutate text='Logging out…' />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='h-full gap-3 p-0 hover:bg-transparent dark:hover:bg-transparent focus-visible:ring-0 sm:pr-1 cursor-pointer'
          >
            <Avatar className='size-9 rounded-full'>
              <Suspense
                fallback={
                  <AvatarFallback>
                    {session.user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                }
              ></Suspense>
              <Image
                src={session.user.image!}
                alt='Logo'
                width={50}
                height={50}
              />
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-75' align={'end'}>
          <DropdownMenuLabel className='flex items-center gap-4 px-4 py-2.5 font-normal'>
            <div className='relative'>
              <Avatar className='size-12 rounded-full'>
                <Suspense
                  fallback={
                    <AvatarFallback>
                      {session.user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  }
                ></Suspense>
                <Image
                  src={session.user.image!}
                  alt='Logo'
                  width={90}
                  height={90}
                />
              </Avatar>
              <span
                className={cn(
                  'ring-card',
                  'absolute',
                  'right-1',
                  'bottom-0',
                  'block',
                  'size-2',
                  'rounded-full',
                  session.user.status === 'online'
                    ? 'bg-green-600'
                    : 'bg-red-600',
                  'ring-2'
                )}
              />
            </div>
            <div className='flex flex-1 flex-col items-start'>
              <span className='text-foreground text-lg font-semibold'>
                {session.user.name.slice(0, 20)}
              </span>
              <span className='text-muted-foreground text-base'>
                {session.user.email}
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
            className='px-4 py-2.5 text-base cursor-pointer'
            onClick={handleLogout}
          >
            <LogOutIcon className='size-5' />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ProfileDropdown;
