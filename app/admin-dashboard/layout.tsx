import { Suspense, type CSSProperties } from 'react';
import Image from 'next/image';

import {
  Banknote,
  Contact,
  FileUser,
  HomeIcon,
  TvMinimalPlay,
  UsersIcon,
  Wallet,
} from 'lucide-react';

import { Card, CardContent } from '@/app/components/ui/card';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
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
  SidebarProvider,
  SidebarTrigger,
} from '@/app/components/ui/sidebar';
import Link from 'next/link';
import { AiOutlineWhatsApp } from 'react-icons/ai';
import { FaInstagram } from 'react-icons/fa6';
import AdminUserDropdown from '@/app/components/admin/AdminUserDropdown';
import { APP_NAME } from '@/lib/constants';
import Theme from '../components/Theme';
import { getUserById } from '@/lib/actions/user';
import { notFound } from 'next/navigation';

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
    label: 'Users',
    href: '/admin-dashboard/users',
  },
  {
    icon: Wallet,
    label: 'Transactions',
    href: '/admin-dashboard/transactions',
  },
  {
    icon: Banknote,
    label: 'Discounts',
    href: '/admin-dashboard/discounts',
  },
];

const recipientsItems = [
  {
    name: 'Liam Anderson',
    avatarSrc:
      'https://res.cloudinary.com/ahmed--dev/image/upload/v1764700356/avatars/jc5t8yphb1crsomdpyo2.jpg',
  },
];

const AdminDashBoardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await getUserById();

  if (!user) return notFound();

  return (
    <div className='bg-muted before:bg-primary relative flex min-h-dvh w-full before:fixed before:inset-x-0 before:top-0 before:h-105'>
      <SidebarProvider
        style={
          {
            '--sidebar': 'var(--card)',
            '--sidebar-width': '17.5rem',
            '--sidebar-width-icon': '3.5rem',
          } as CSSProperties
        }
      >
        <Sidebar
          variant='floating'
          collapsible='icon'
          className='p-6 pr-0 [&>[data-slot=sidebar-inner]]:group-data-[variant=floating]:rounded-xl'
        >
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size='lg'
                  className='gap-2.5 !bg-transparent [&>svg]:size-8'
                  asChild
                >
                  <Link href='/admin-dashboard'>
                    <Image
                      src='/images/logo.png'
                      alt='Logo'
                      width={32}
                      height={32}
                    />
                    <span className='text-xl font-semibold'>Admin</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Pages</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {pagesItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild>
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Admins</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {recipientsItems.map((recipient) => (
                    <SidebarMenuItem
                      className='flex items-center gap-2 px-2'
                      key={recipient.name}
                    >
                      <Avatar className='size-7 rounded-full'>
                        <Suspense
                          fallback={
                            <AvatarFallback className='rounded-full'>
                              {recipient.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          }
                        >
                          <Image
                            src={recipient.avatarSrc}
                            alt={recipient.name}
                            width={28}
                            height={28}
                            className='object-cover'
                          />
                        </Suspense>
                      </Avatar>
                      <span>{recipient.name}</span>
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
        <div className='z-1 mx-auto flex size-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6'>
          <header className='bg-card mb-6 flex items-center justify-between rounded-xl px-6 py-3.5'>
            <SidebarTrigger className='[&_svg]:!size-5' />
            <Theme />
          </header>
          <main className='mb-6 size-full flex-1'>
            <Card className='h-auto shadow-none'>
              <CardContent className='h-full grid grid-cols-1 md:grid-cols-3'>
                {children}
              </CardContent>
            </Card>
          </main>

          {/* Footer */}
          <footer className='bg-card  flex items-center justify-between gap-3 border-t px-4 py-4 max-md:flex-col sm:px-6 md:gap-6 md:py-3'>
            <p className='text-muted-foreground text-center text-sm text-balance'>
              {`©${new Date().getFullYear()}`}{' '}
              <Link href='/' className='text-primary'>
                {APP_NAME}
              </Link>
            </p>
            <div className='flex items-center gap-5 text-sm whitespace-nowrap'>
              <Link href='#'>Privacy Policy</Link>
              <Link href='/about'>About</Link>
              <Link href='/contact'>Contact Us</Link>
            </div>
            <div className='text-muted-foreground flex items-center gap-3'>
              <a
                target='_blank'
                href='https://www.instagram.com'
                rel='noreferrer'
              >
                <FaInstagram className='size-6' />
              </a>
              <a
                target='_blank'
                href='https://www.whatsapp.com'
                rel='noreferrer'
              >
                <AiOutlineWhatsApp className='size-6' />
              </a>
            </div>
          </footer>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminDashBoardLayout;
