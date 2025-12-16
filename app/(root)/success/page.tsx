import { Button } from '@/app/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import stripe from '@/lib/stripe';
import { notFound } from 'next/navigation';

const SuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const { orderId, session_id } = await searchParams;
  if (!session_id) notFound();
  const session = await stripe.checkout.sessions?.retrieve(session_id);

  if (!session) throw new Error('Invalid session_id');

  return (
    <section className='flex flex-col items-center mt-10 min-h-screen space-y-6 px-3'>
      <Image
        src={'/svg/checkmark.svg'}
        alt='Success-logo'
        width={100}
        height={100}
        className='mx-auto'
      />
      <div className='space-y-4 text-center'>
        <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-center'>
          Thank you for your purchase!
        </h1>
        <p className='text-center text-lg sm:text-xl md:text-2xl text-muted-foreground  md:mb-7'>
          You should receive an order confirmation email shortly.
        </p>
        <Button size={'lg'} className='text-base cursor-pointer h-11' asChild>
          <Link href={`/order/${orderId}`}>View Order</Link>
        </Button>
      </div>
    </section>
  );
};

export default SuccessPage;
