import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { APP_NAME, SERVER_URL } from '@/lib/constants';
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from 'react-hot-toast';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { knock } from '@/lib/knock';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: `${APP_NAME}`,
  },
  description:
    'Discover flexible, engaging courses designed to help you master new skills and grow with confidence.',
  metadataBase: new URL(SERVER_URL!),
  openGraph: {
    title: APP_NAME,
    description:
      'Discover flexible, engaging courses designed to help you master new skills and grow with confidence.',
    url: SERVER_URL,
    siteName: APP_NAME,
  },
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    // Identify and create user for knock notification
    await knock.users.update(session.user.id, {
      name: session.user.name,
      email: session.user.email,
    });
  }

  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn(outfit.className)}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>{children}</NuqsAdapter>
          {/* <Toaster
            position='top-right'
            icons={{
              success: <CircleCheckBig className='text-emerald-500 size-4.5' />,
              error: <CircleX className='text-red-500 size-4.5' />,
            }}
          /> */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
