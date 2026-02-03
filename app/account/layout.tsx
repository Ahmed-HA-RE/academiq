import { extractRouterConfig } from 'uploadthing/server';
import Header from '../components/account/header';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { ourFileRouter } from '../api/uploadthing/core';

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='min-h-screen flex flex-col w-full overflow-hidden'>
      {/* UploadThing SSR Hydration Plugin */}
      <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
      <Header />
      <main className='w-full flex-grow'>{children}</main>
    </div>
  );
};

export default AccountLayout;
