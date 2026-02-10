import DynamicTitle from '../components/auth/DynamicTitle';
import Header from '../components/header/Header';
import Image from 'next/image';

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <>
      <Header />
      <div className='max-lg:min-h-screen max-w-xl xl:max-w-7xl mx-auto max-sm:px-6 section-spacing flex max-lg:items-center max-lg:justify-center'>
        <div className='grid grid-cols-1 xl:grid-cols-3 items-center justify-between gap-12 w-full'>
          {/* Left Image Col */}
          <Image
            src={'/images/auth_img_2.png'}
            alt='Auth 1 Illustration'
            width={350}
            height={470}
            sizes='100vw'
            className='hidden xl:block'
          />
          {/* Middle Form Col */}
          <div className='flex flex-col items-center justify-center gap-7'>
            <DynamicTitle />
            {children}
          </div>
          {/* Right Image Col */}
          <Image
            src={'/images/auth_img_1.png'}
            alt='Auth 2 Illustration'
            width={527}
            height={377}
            sizes='100vw'
            className='hidden xl:block'
          />
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
