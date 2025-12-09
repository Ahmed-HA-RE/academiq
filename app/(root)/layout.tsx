import { headers } from 'next/headers';
import Footer from '../components/Footer';
import Header from '../components/header/Header';
import VerificationBanner from '../components/VerificationBanner';
import { auth } from '@/lib/auth';

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className='min-h-screen flex flex-col w-full relative overflow-hidden'>
      {/* Midnight Radial Glow Background */}
      <div
        className='absolute inset-0 z-0 hidden dark:block'
        style={{
          background: `
        radial-gradient(circle at 50% 50%, 
          rgba(226, 232, 240, 0.2) 0%, 
          rgba(226, 232, 240, 0.1) 25%, 
          rgba(226, 232, 240, 0.05) 35%, 
          transparent 50%
        )
      `,
        }}
      />
      {session && !session?.user.emailVerified && <VerificationBanner />}
      <Header />
      <main className='w-full flex-grow'>{children}</main>
      <Footer />
    </div>
  );
};

export default RootLayout;
