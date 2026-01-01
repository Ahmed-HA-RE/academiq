'use client';

import { Instructor } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { VisuallyHidden } from 'radix-ui';
import Image from 'next/image';

import { Button } from '../ui/button';
import { CalendarDays, Mail, MapPin, Phone } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import {
  IoLogoInstagram,
  IoLogoLinkedin,
  IoLogoWhatsapp,
} from 'react-icons/io5';

const InstructorInfoDialog = ({ instructor }: { instructor: Instructor }) => {
  return (
    <Dialog>
      <DialogTrigger className='cursor-pointer' asChild>
        <Button variant={'outline'} size={'sm'}>
          Meet the Instructor
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-(image:--color-instructor-dialog-gradient) border-0 dark:text-black'>
        <DialogHeader>
          <VisuallyHidden.Root>
            <DialogTitle> Instructor Information </DialogTitle>
            <DialogDescription></DialogDescription>
          </VisuallyHidden.Root>
        </DialogHeader>
        <div className='flex flex-col items-start gap-4 mt-6'>
          {/* Image */}
          <div className='border-4 border-white rounded-full overflow-hidden'>
            <Image
              src={instructor.user.image}
              alt={`${instructor.phone}'s avatar`}
              width={100}
              height={100}
              className='rounded-full '
              loading='eager'
            />
          </div>
          {/* Instructor Info */}
          <div className='space-y-5'>
            <div className='space-y-1'>
              {/* Name */}
              <h3 className='text-xl font-medium'>{instructor.user.name}</h3>
              {/* Job */}
              <h4>{instructor.expertise.join(', ')}</h4>
            </div>
            {/* Address */}
            <p className='flex items-center gap-2 '>
              <MapPin size={24} />
              {instructor.address}
            </p>
            {/* Bio */}
            <p>{instructor.bio}</p>
            <div className='space-y-3'>
              {/* Email */}
              <span className='flex items-center gap-3'>
                <Mail size={20} /> {instructor.user.email}
              </span>
              {/* birthDate */}
              <span className='flex items-center gap-3'>
                <CalendarDays size={20} />{' '}
                {formatDate(new Date(instructor.birthDate), 'date')}
              </span>
              {/* Phone */}
              <span className='flex items-center gap-3'>
                <Phone size={20} /> {instructor.phone}
              </span>
            </div>
            {/* Social Media */}
            <div className='flex flex-row items-center justify-end gap-2'>
              {/* Instagram */}
              {instructor.socialLinks.instagram && (
                <a
                  href={instructor.socialLinks.instagram}
                  target='_blank'
                  className='text-3xl'
                >
                  <IoLogoInstagram />
                </a>
              )}
              {/* LinkedIn */}
              {instructor.socialLinks.linkedin && (
                <a
                  href={instructor.socialLinks.linkedin}
                  target='_blank'
                  className='text-3xl'
                >
                  <IoLogoLinkedin />
                </a>
              )}
              {/* Whatsapp */}
              {instructor.socialLinks.whatsapp && (
                <a
                  href={instructor.socialLinks.whatsapp}
                  target='_blank'
                  className='text-3xl'
                >
                  <IoLogoWhatsapp />
                </a>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstructorInfoDialog;
