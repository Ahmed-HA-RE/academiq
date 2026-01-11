import type { CSSProperties } from 'react';
import { Separator } from '@/app/components/ui/separator';
import { Card, CardContent } from '@/app/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/app/components/ui/sidebar';
import ProfileDropdown from '../components/shared/ProfileDropdown';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Theme from '../components/Theme';
import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';
import { FaInstagram } from 'react-icons/fa6';
import { AiOutlineWhatsApp } from 'react-icons/ai';
import { Metadata } from 'next';
import SideBar from '../components/instructor/SideBar';
import Notification from '../components/instructor/Notification';
import VideoProcessBanner from '../components/instructor/VideoProcessBanner';

export const metadata: Metadata = {
  title: {
    default: 'Instructor Dashboard',
    template: '%s | Instructor Dashboard',
  },
  description:
    'Manage your courses, track student progress, monitor revenue, and analyze your teaching performance all in one place.',
};

const InstructorDashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className='flex min-h-dvh w-full'>
      <SidebarProvider
        defaultOpen={false}
        style={{ '--sidebar-width-icon': '4.7625rem' } as CSSProperties}
      >
        <SideBar />
        <div className='flex flex-1 flex-col'>
          <VideoProcessBanner />
          <header className='bg-card sticky top-0 z-50 border-b'>
            <div className='mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2 sm:px-6'>
              <div className='flex items-center gap-4'>
                <SidebarTrigger className='md:hidden [&_svg]:!size-5' />
                <Separator
                  orientation='vertical'
                  className='hidden !h-4 sm:max-md:block'
                />
              </div>
              <div className='flex items-center'>
                {/* Theme */}
                <Theme />
                {/* Notifications */}
                <Notification />

                {/* Instructor Profile */}
                <ProfileDropdown session={session} />
              </div>
            </div>
          </header>
          <main className='mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6'>
            <Card className='h-auto shadow-none'>
              <CardContent className='h-full grid grid-cols-1 md:grid-cols-4 gap-6'>
                {children}
              </CardContent>
            </Card>
          </main>

          {/* Footer */}
          <footer className='bg-card border-t px-4 py-4 sm:px-6 md:gap-6 md:py-3'>
            <div className='flex items-center justify-between gap-3 max-md:flex-col max-w-[1220px] mx-auto'>
              <p className='text-muted-foreground text-center text-sm text-balance'>
                {`©${new Date().getFullYear()}`}{' '}
                <Link href='/' className='text-primary'>
                  {APP_NAME}
                </Link>
              </p>
              <div className='flex items-center gap-5 text-sm whitespace-nowrap'>
                <Link href='#'>Privacy Policy</Link>
                <Link href='/about'>About</Link>
                <Link href='/contact-us'>Contact Us</Link>
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
            </div>
          </footer>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default InstructorDashboardLayout;
