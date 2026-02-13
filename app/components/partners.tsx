import { cn } from '@/lib/utils';
import Image from 'next/image';

const brandLogos = [
  {
    image: '/images/udemy.png',
    name: 'Udemy',
    size: 'h-8 w-auto',
  },
  {
    image: '/images/partners/stripe.png',
    name: 'Stripe',
    size: 'h-10 w-auto',
  },
  {
    image: '/images/partners/google.png',
    name: 'Google',
    size: 'h-6 w-auto',
  },
  {
    image: '/images/partners/linkedin-learning.png',
    name: 'LinkedIn Learning',
    size: 'h-9 w-auto',
  },
  {
    image: '/images/partners/microsoft.png',
    name: 'Microsoft',
    size: 'h-6 w-auto',
  },
  {
    image: '/images/partners/zoom.png',
    name: 'Zoom',
    size: 'h-4 w-auto',
  },
];

const Partners = () => {
  return (
    <section className='section-spacing bg-white'>
      <div className='container'>
        {/* Header */}
        <h2 className='text-lg md:text-xl lg:text-2xl mb-12 text-center'>
          Join the 50+ leading companies that trust us
        </h2>
        <div className='flex flex-wrap items-center justify-center gap-x-10 gap-y-6'>
          {brandLogos.map((logo, index) => (
            <Image
              key={index}
              src={logo.image}
              alt={logo.name}
              className={cn(logo.size)}
              width={0}
              height={0}
              sizes='100vw'
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
