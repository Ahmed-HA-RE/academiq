import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { APP_NAME, SERVER_URL } from 'app/lib/constants';

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

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang='en'>
      <body className={outfit.className}>{children}</body>
    </html>
  );
};

export default RootLayout;
