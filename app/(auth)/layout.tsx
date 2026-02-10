import DynamicTitle from '../components/auth/DynamicTitle';
import Image from 'next/image';

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className='min-h-screen w-full bg-white relative'>
      {/* Magenta Orb Grid Background */}
      <div
        className='absolute inset-0 z-0'
        style={{
          background: 'white',
          backgroundImage: `
     linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
     linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
     radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
   `,
          backgroundSize: '40px 40px, 40px 40px, 100% 100%',
        }}
      />

      {/* Your Content/Components */}
      <div className='max-lg:min-h-screen max-w-xl xl:max-w-7xl mx-auto max-sm:px-6 section-spacing flex max-lg:items-center max-lg:justify-center absolute inset-0 z-10'>
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
    </div>
  );
};

export default AuthLayout;
