import Footer from '../components/Footer';
import Header from '../components/header/Header';
import ScrollToTopBtn from '../components/ScrollToTopBtn';

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='min-h-screen flex flex-col w-full'>
      <Header />
      <main className='w-full flex-grow bg-[#FDF8F5] dark:bg-[#121212]'>
        {children}
      </main>
      <Footer />
      <ScrollToTopBtn />
    </div>
  );
};

export default RootLayout;
