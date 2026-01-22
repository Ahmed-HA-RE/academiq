'use client';

import { Instructor } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { VisuallyHidden } from 'radix-ui';
import Image from 'next/image';

import { Button } from '../ui/button';
import { BadgeCheck, CalendarDays, Mail, MapPin, Sparkles } from 'lucide-react';
import {
  IoLogoInstagram,
  IoLogoLinkedin,
  IoLogoWhatsapp,
} from 'react-icons/io5';
import { format } from 'date-fns';

const InstructorInfoDialog = ({ instructor }: { instructor: Instructor }) => {
  return (
    <Dialog>
      <DialogTrigger
        className='cursor-pointer text-xs font-semibold bg-blue-500 hover:bg-blue-600 dark:bg-amber-500 hover:dark:bg-amber-500/80 text-white   transition duration-300 w-full'
        asChild
      >
        <Button variant={'default'} size={'lg'}>
          <Sparkles className='size-3.5' />
          Meet the Instructor
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl border-0 p-0 overflow-hidden bg-white dark:bg-gray-900'>
        <DialogHeader>
          <VisuallyHidden.Root>
            <DialogTitle> Instructor Information </DialogTitle>
            <DialogDescription></DialogDescription>
          </VisuallyHidden.Root>
        </DialogHeader>

        {/* Content Section */}
        <div className='p-8 space-y-6'>
          {/* Profile Picture & Name */}
          <div className='flex flex-col items-center text-center space-y-4'>
            <div className='relative'>
              <div className='relative border-4 border-white dark:border-gray-800 rounded-full overflow-hidden shadow-2xl'>
                <Image
                  src={instructor.user.image}
                  alt={`${instructor.user.name}'s avatar`}
                  width={120}
                  height={120}
                  className='rounded-full'
                  loading='eager'
                />
              </div>
              <div className='absolute -bottom-1 -right-1 bg-green-500 p-1.5 rounded-full border-4 border-white dark:border-gray-800 shadow-lg'>
                <BadgeCheck className='size-5 text-white' />
              </div>
            </div>

            <div className='space-y-2'>
              <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                {instructor.user.name}
              </h3>
              <div className='flex flex-wrap gap-2 justify-center'>
                {instructor.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className='px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full border border-blue-200 dark:border-blue-800'
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className='bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700'>
            <p className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed'>
              {instructor.bio}
            </p>
          </div>

          {/* Contact Info Grid - Single Column */}
          <div className='grid grid-cols-1 gap-4'>
            {/* Location */}
            <div className='flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
              <div className='p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg'>
                <MapPin className='size-4 text-blue-600 dark:text-blue-400' />
              </div>
              <div>
                <p className='text-xs text-gray-500 dark:text-gray-400 font-medium'>
                  Location
                </p>
                <p className='text-sm text-gray-900 dark:text-white font-medium'>
                  {instructor.address}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className='flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
              <div className='p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg'>
                <Mail className='size-4 text-purple-600 dark:text-purple-400' />
              </div>
              <div className='overflow-hidden flex-1'>
                <p className='text-xs text-gray-500 dark:text-gray-400 font-medium'>
                  Email
                </p>
                <p className='text-sm text-gray-900 dark:text-white font-medium truncate'>
                  {instructor.user.email}
                </p>
              </div>
            </div>

            {/* Joined on  */}
            <div className='flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
              <div className='p-2 bg-green-100 dark:bg-green-900/30 rounded-lg'>
                <CalendarDays className='size-4 text-green-600 dark:text-green-400' />
              </div>
              <div>
                <p className='text-xs text-gray-500 dark:text-gray-400 font-medium'>
                  Member Since
                </p>
                <p className='text-sm text-gray-900 dark:text-white font-medium'>
                  {format(new Date(instructor.createdAt), 'M/dd/yyyy')}
                </p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          {(instructor.socialLinks.instagram ||
            instructor.socialLinks.linkedin ||
            instructor.socialLinks.whatsapp) && (
            <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
              <p className='text-xs text-gray-500 dark:text-gray-400 font-medium mb-3'>
                Connect on Social Media
              </p>
              <div className='flex items-center gap-3'>
                {instructor.socialLinks.instagram && (
                  <a
                    href={instructor.socialLinks.instagram}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl hover:scale-110 transition-transform shadow-lg'
                  >
                    <IoLogoInstagram className='size-5' />
                  </a>
                )}
                {instructor.socialLinks.linkedin && (
                  <a
                    href={instructor.socialLinks.linkedin}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='p-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl hover:scale-110 transition-transform shadow-lg'
                  >
                    <IoLogoLinkedin className='size-5' />
                  </a>
                )}
                {instructor.socialLinks.whatsapp && (
                  <a
                    href={instructor.socialLinks.whatsapp}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='p-3 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:scale-110 transition-transform shadow-lg'
                  >
                    <IoLogoWhatsapp className='size-5' />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstructorInfoDialog;
