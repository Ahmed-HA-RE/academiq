import Link from 'next/link';
import { Button } from '../components/ui/button';
import Image from 'next/image';

const BannedUserPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const { error } = await searchParams;

  return (
    <section className='flex flex-col items-center justify-center min-h-screen space-y-6 px-3'>
      <Image
        src={'/svg/caution.svg'}
        alt='Success-logo'
        width={100}
        height={100}
        className='mx-auto'
      />
      <div className='space-y-4 text-center'>
        <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-center'>
          Access Denied!
        </h1>
        <p className='text-center text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto'>
          {error}
        </p>
        <Button size={'lg'} className='text-base cursor-pointer h-11' asChild>
          <Link href={`/`}>Go Home</Link>
        </Button>
      </div>
    </section>
  );
};

export default BannedUserPage;
