import { ShieldCheckIcon } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

import { LuInstagram } from 'react-icons/lu';

import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';

const footerResourcesLinks = [
  { name: 'Courses', href: '/courses' },
  { name: 'Prices', href: '/prices' },
];

const footerSupportLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'FAQs', href: '/faqs' },
  { name: 'Terms & Conditions', href: '/' },
];

const Footer = () => {
  return (
    <footer className='z-10'>
      <div className='mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2  lg:grid-cols-4'>
        <div className='flex flex-col items-start gap-4 lg:col-span-2'>
          <Link className='flex flex-row items-center gap-2' href='/'>
            <Image src={'/images/logo.png'} alt='Logo' width={45} height={45} />
            <span className='font-bold text-2xl'>{APP_NAME}</span>
          </Link>
          <p className='text-muted-foreground text-balance'>
            A curated collection of ready to learn video courses and lessons,
            organized by topics and sections—paired with practical exercises and
            real world projects to help learners build, practice, and master
            skills faster.
          </p>
          <div className='flex items-center gap-3'>
            <a
              href='https://www.instagram.com'
              target='_blank'
              rel='noopener noreferrer'
            >
              <LuInstagram className='size-5 text-pink-600' />
            </a>
            <a
              href='https://www.whatsapp.com'
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaWhatsapp className='text-green-600 size-5' />
            </a>
          </div>
        </div>

        {/* Resources */}
        <div className='flex flex-col gap-5'>
          <div className='text-lg font-medium'>Resources</div>
          <ul className='text-muted-foreground space-y-3'>
            {footerResourcesLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className='flex flex-col gap-5'>
          <div className='text-lg font-medium'>Help and Support</div>
          <ul className='text-muted-foreground w-full space-y-3'>
            {footerSupportLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Separator />

      <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-6 sm:px-6'>
        <p className='font-medium'>
          {`©${new Date().getFullYear()}`} <a href='#'>Academiq</a>, All rights
          reserved.
        </p>

        <div className='flex flex-wrap items-center gap-4'>
          <Badge variant='outline' className='text-base font-normal'>
            <ShieldCheckIcon className='!size-4.5 text-green-600' /> Secure
            Payment
          </Badge>

          <Image
            src='/images/stripe.png'
            alt='Stripe'
            width={70}
            height={70}
            loading='eager'
            className='w-auto h-auto'
          />
          <Image
            src='/images/visa.png'
            alt='Visa'
            width={50}
            height={50}
            loading='eager'
            className='w-auto h-auto'
          />
          <Image
            src='/images/master-card.png'
            alt='Mastercard'
            width={50}
            height={50}
            loading='eager'
            className='w-auto h-auto'
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
