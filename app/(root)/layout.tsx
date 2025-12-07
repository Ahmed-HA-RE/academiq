import Footer from '../components/Footer';
import Header from '../components/header/Header';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='min-h-screen flex flex-col w-full relative'>
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
      <Header />
      <main className='w-full flex-grow z-10'>{children}</main>
      <Footer />
    </div>
  );
};

export default RootLayout;
