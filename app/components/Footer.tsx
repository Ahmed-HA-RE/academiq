'use client';

import { FaWhatsapp } from 'react-icons/fa';
import { LuInstagram } from 'react-icons/lu';
import { Separator } from '@/app/components/ui/separator';
import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';

const footerResourcesLinks = [
  { name: 'Courses', href: '/courses' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Become An Instructor', href: '/teach' },
];

const footerSupportLinks = [
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Terms & Conditions', href: '/terms' },
];

const Footer = () => {
  return (
    <footer className='z-10 border-t bg-foreground pt-18 pb-14'>
      <div className='container'>
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-start'>
          <div className='flex flex-col items-start gap-4 lg:col-span-2'>
            <div className='flex flex-row items-center gap-2'>
              <Image
                src={'/images/logo.png'}
                alt='Logo'
                width={35}
                height={35}
              />
              <span className='font-bold text-2xl text-white'>{APP_NAME}</span>
            </div>
            <p className='text-balance text-white/80 max-w-lg'>
              A curated collection of ready to learn video courses and lessons,
              organized by topics and sections—paired with practical exercises
              and real world projects to help learners build, practice, and
              master skills faster.
            </p>
            <div className='flex items-center gap-3'>
              <a
                href='https://www.instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:scale-105 transition rounded-full p-1.5 bg-white/10'
              >
                <LuInstagram className='size-4.5 text-white/80' />
              </a>
              <a
                href='https://www.whatsapp.com'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:scale-105 transition rounded-full p-1.5 bg-white/10'
              >
                <FaWhatsapp className='size-4.5 text-white/80' />
              </a>
            </div>
          </div>

          {/* Resources */}
          <div className='flex flex-col gap-5'>
            <div className='text-lg font-medium text-white'>Resources</div>
            <ul className='text-muted-foreground space-y-3'>
              {footerResourcesLinks.map((link) => (
                <li key={link.name}>
                  <Link className='text-white/90' href={link.href}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className='flex flex-col gap-5'>
            <div className='text-lg font-medium text-white'>
              Help and Support
            </div>
            <ul className='text-white/80 w-full space-y-3'>
              {footerSupportLinks.map((link) => (
                <li key={link.name}>
                  <Link className='text-white/80' href={link.href}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Separator className='bg-gray-50/40 my-6' />

        <div className='flex flex-wrap items-center justify-between gap-3'>
          <p className='font-medium text-white/80'>
            {`©${new Date().getFullYear()}`} Academiq, All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
