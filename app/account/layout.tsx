import Header from '../components/account/header';

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='min-h-screen flex flex-col w-full overflow-hidden'>
      <Header />
      <main className='w-full flex-grow z-20'>{children}</main>
    </div>
  );
};

export default AccountLayout;
