import Footer from '../components/Footer';
import Header from '../components/header/Header';
import ScrollToTopBtn from '../components/ScrollToTopBtn';

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='min-h-screen flex flex-col overflow-hidden'>
      <Header />
      <main className='w-full flex-grow'>{children}</main>
      <Footer />
      <ScrollToTopBtn />
    </div>
  );
};

export default RootLayout;
