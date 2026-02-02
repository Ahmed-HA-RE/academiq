import { Metadata } from 'next';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';

export const metadata: Metadata = {
  title: 'Account',
  description:
    'Manage your Academiq account settings, Orders and subscription.',
};

const AccountPage = () => {
  return (
    <section className='py-6 sm:py-8 lg:py-10'>
      <div className='container'>
        <h1 className='font-bold text-3xl sm:text-3xl lg:text-3xl mb-6'>
          Account Information
        </h1>
        <Tabs className='items-start' defaultValue='account-details'>
          <TabsList className='h-auto rounded-none bg-transparent p-0'>
            <TabsTrigger
              className='relative rounded-none py-2 mr-3 px-0 after:absolute after:inset-x-0 after:bottom-0  after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary dark:data-[state=active]:bg-0 text-base'
              value='account-details'
            >
              Account Details
            </TabsTrigger>
            <TabsTrigger
              className='relative rounded-none py-2 px-0 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary dark:data-[state=active]:bg-0 text-base'
              value='subscription-billing'
            >
              Subscription & Billing
            </TabsTrigger>
          </TabsList>
          <TabsContent value='account-details'>
            <p className='p-4 text-center text-muted-foreground text-xs'>
              Content for Tab 1
            </p>
          </TabsContent>
          <TabsContent value='subscription-billing'>
            <p className='p-4 text-center text-muted-foreground text-xs'>
              Content for Tab 2
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default AccountPage;
