import { Metadata } from 'next';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import { getCurrentLoggedUser } from '@/lib/actions/getUser';
import AccountDetails from '../components/account/account-details';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Account',
  description:
    'Manage your Academiq account settings, Orders and subscription.',
};

const AccountPage = async () => {
  const user = await getCurrentLoggedUser();

  if (!user) {
    return redirect('/login');
  }

  return (
    <section className='py-6 sm:py-8 lg:py-10'>
      <div className='container'>
        <h1 className='font-bold text-3xl sm:text-3xl lg:text-3xl mb-6'>
          Account Information
        </h1>
        <Tabs className='items-start' defaultValue='account-details'>
          <TabsList className='h-auto rounded-none bg-transparent p-0 '>
            <TabsTrigger
              className='relative rounded-none py-2 px-0 after:absolute after:inset-x-0 after:bottom-0  after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary dark:data-[state=active]:bg-0 text-base'
              value='account-details'
            >
              Account Details
            </TabsTrigger>
            <TabsTrigger
              className='relative rounded-none py-2 px-0 mx-3 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary dark:data-[state=active]:bg-0 text-base'
              value='purchase-history'
            >
              Purchase History
            </TabsTrigger>
            <TabsTrigger
              className='relative rounded-none py-2 mr-3 px-0 after:absolute after:inset-x-0 after:bottom-0  after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary dark:data-[state=active]:bg-0 text-base'
              value='subscription'
            >
              Subscription
            </TabsTrigger>
          </TabsList>
          <TabsContent className='mt-12 w-full' value='account-details'>
            <AccountDetails user={user} />
          </TabsContent>
          <TabsContent className='mt-12' value='purchase-history'>
            <p className='p-4 text-center text-muted-foreground text-xs'>
              Content for Tab 2
            </p>
          </TabsContent>
          <TabsContent className='mt-12' value='subscription'>
            <p className='p-4 text-center text-muted-foreground text-xs'>
              Content for Tab 3
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default AccountPage;
