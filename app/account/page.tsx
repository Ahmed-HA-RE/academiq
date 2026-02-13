import { Metadata } from 'next';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import AccountDetails from '../components/account/account-details';
import PurchaseHistoryCard from '../components/account/purchase-history-card';
import { getAllUserOrders } from '@/lib/actions/user/get-all-user-orders';
import { Alert, AlertTitle } from '../components/ui/alert';
import { CircleAlertIcon } from 'lucide-react';
import Subscription from '../components/account/subscription';
import { listUserSubscription } from '@/lib/actions/subscription/list-user-subscription';

export const metadata: Metadata = {
  title: 'Account',
  description:
    'Manage your Academiq account settings, Orders and subscription.',
};

const AccountPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const [orders, subscription] = await Promise.all([
    getAllUserOrders(),
    listUserSubscription(),
  ]);

  const callbackUrl = (await searchParams).callbackUrl || 'account-details';

  return (
    <section className='py-6 sm:py-8 lg:py-10'>
      <div className='container'>
        <h1 className='font-bold text-3xl sm:text-3xl lg:text-3xl mb-6'>
          Account Information
        </h1>
        <Tabs className='items-start' defaultValue={callbackUrl}>
          <TabsList className='h-auto rounded-none bg-transparent p-0'>
            <TabsTrigger
              className='relative rounded-none py-2 px-0 after:absolute after:inset-x-0 after:bottom-0  after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary dark:data-[state=active]:bg-0 text-base text-primary'
              value='account-details'
            >
              Account Details
            </TabsTrigger>
            <TabsTrigger
              className='relative rounded-none py-2 px-0 mx-3 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary dark:data-[state=active]:bg-0 text-base text-primary'
              value='purchase-history'
            >
              Purchase History
            </TabsTrigger>
            <TabsTrigger
              className='relative rounded-none py-2 mr-3 px-0 after:absolute after:inset-x-0 after:bottom-0  after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary dark:data-[state=active]:bg-0 text-base text-primary'
              value='subscription'
            >
              Subscription
            </TabsTrigger>
          </TabsList>
          <TabsContent className='mt-12 w-full' value='account-details'>
            <AccountDetails />
          </TabsContent>
          <TabsContent className='mt-12 w-full' value='purchase-history'>
            <div className='flex flex-col lg:flex-row items-start gap-5'>
              <div className='space-y-3 lg:flex-1/4'>
                <h3 className='text-xl font-semibold'>Your Purchase History</h3>
                <p className='text-secondary-foreground text-sm lg:max-w-md'>
                  Review your past orders and download invoices for your
                  records.
                </p>
              </div>
              <div className='lg:flex-1/2 w-full'>
                {orders.length === 0 ? (
                  <Alert className='bg-primary/10 border-none max-w-sm'>
                    <CircleAlertIcon />
                    <AlertTitle>You have no purchase history.</AlertTitle>
                  </Alert>
                ) : (
                  orders.map((order) => (
                    <PurchaseHistoryCard key={order.id} order={order} />
                  ))
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent className='mt-12 w-full' value='subscription'>
            <Subscription subscription={subscription} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default AccountPage;
