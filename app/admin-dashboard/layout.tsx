import { Card, CardContent } from '@/app/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/app/components/ui/sidebar';
import Link from 'next/link';
import { AiOutlineWhatsApp } from 'react-icons/ai';
import { FaInstagram } from 'react-icons/fa6';
import { APP_NAME } from '@/lib/constants';
import Theme from '../components/Theme';
import { getAllAdmins, getCurrentLoggedUser } from '@/lib/actions/user';
import { notFound } from 'next/navigation';
import { CSSProperties } from 'react';
import SideBar from '../components/admin/SideBar';
import { markAsExpiredAndDeleteOrdersAsAdmin } from '@/lib/actions/order';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard',
    template: 'Admin Dashboard - %s',
  },
};

const AdminDashBoardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, admins] = await Promise.all([
    getCurrentLoggedUser(),
    getAllAdmins(),
    markAsExpiredAndDeleteOrdersAsAdmin(),
  ]);

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
        <SideBar user={user} admins={admins} />
        <div className='z-1 mx-auto flex size-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6'>
          <header className='bg-card mb-6 flex items-center justify-between rounded-xl px-6 py-3.5'>
            <SidebarTrigger className='[&_svg]:!size-5 cursor-pointer' />
            <Theme />
          </header>
          <main className='mb-6 size-full flex-1 '>
            <Card className='h-auto shadow-none'>
              <CardContent className='h-full grid grid-cols-1 md:grid-cols-4 gap-6'>
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
