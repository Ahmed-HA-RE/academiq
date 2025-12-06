import Header from '../components/header/Header';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='container'>{children}</main>
    </div>
  );
};

export default RootLayout;
