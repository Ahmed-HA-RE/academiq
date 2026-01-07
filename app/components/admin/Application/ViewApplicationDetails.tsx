'use client';
import { updateApplicationStatusById } from '@/lib/actions/instructor/application';
import { Metadata } from 'next';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  CalendarIcon,
  CircleIcon,
  FileTextIcon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense, useTransition } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { InstructorApplication } from '@/types';
import ScreenSpinner from '../../ScreenSpinner';
import Stripe from 'stripe';
import { notifyApplicant } from '@/lib/actions/instructor';
import { FaCity } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'View Application',
  description: 'View instructor application details',
};

const ViewApplicationDetails = ({
  application,
  account,
}: {
  application: InstructorApplication;
  account: Stripe.Account;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleUpdateStatus = async (status: string) => {
    startTransition(async () => {
      const res = await updateApplicationStatusById(application.id, status);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
    });
  };

  const isPaymentEligible =
    account.payouts_enabled &&
    account.requirements?.currently_due?.length === 0;

  return isPending ? (
    <ScreenSpinner mutate={true} text='Processing...' />
  ) : (
    <div className='col-span-4 space-y-6'>
      {/* Header Card */}
      <Card className='relative'>
        <CardHeader>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6'>
            <Avatar className='size-20'>
              <Suspense
                fallback={
                  <AvatarFallback className='text-2xl'>
                    {application.user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                }
              >
                <Image
                  src={application.user.image}
                  alt={application.user.name}
                  width={80}
                  height={80}
                />
              </Suspense>
            </Avatar>

            <div className='flex-1 space-y-2'>
              {/* Name */}
              <CardTitle className='text-2xl sm:text-3xl'>
                {application.user.name}
              </CardTitle>
              <div className='flex flex-wrap items-center gap-3'>
                {/* Email */}
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <MailIcon className='size-4' />
                  <span className='text-sm'>{application.user.email}</span>
                </div>
                {/* Status */}
                <Badge
                  className={cn(
                    application.status === 'approved'
                      ? 'bg-green-600/10 text-green-600'
                      : application.status === 'rejected'
                        ? 'bg-red-600/10 text-red-600'
                        : 'bg-amber-600/10 text-amber-600',
                    'absolute top-4 right-4'
                  )}
                >
                  {application.status.charAt(0).toUpperCase() +
                    application.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Left Column */}
        <div className='space-y-6'>
          {/* Personal Information */}
          <Card>
            <CardHeader className='border-b [.border-b]:pb-4 gap-0'>
              <CardTitle className='flex items-center gap-2'>
                <UserIcon className='size-5' />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Birth date */}
              <div className='flex items-start gap-3'>
                <CalendarIcon className='size-5 text-muted-foreground mt-0.5' />
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Date of Birth
                  </p>
                  <p className='text-base'>
                    {format(new Date(application.birthDate), 'MM/dd/yyyy')}
                  </p>
                </div>
              </div>

              {/* Phone Number */}
              <div className='flex items-start gap-3'>
                <PhoneIcon className='size-5 text-muted-foreground mt-0.5' />
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Phone Number
                  </p>
                  <p className='text-base'>{application.phone}</p>
                </div>
              </div>

              {/* City */}
              <div className='flex items-start gap-3'>
                <FaCity className='size-5 text-muted-foreground mt-0.5' />
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    City
                  </p>
                  <p className='text-base'>{application.city}</p>
                </div>
              </div>

              {/* Address */}
              <div className='flex items-start gap-3'>
                <MapPinIcon className='size-5 text-muted-foreground mt-0.5' />
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Address
                  </p>
                  <p className='text-base'>{application.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expertise */}
          <Card className='gap-5'>
            <CardHeader className='gap-0 border-b [.border-b]:pb-4'>
              <CardTitle>Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                {application.expertise.map((skill, index) => (
                  <Badge
                    key={index}
                    variant='outline'
                    className='px-3 py-1.5 text-sm bg-primary/5 border-primary/20'
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Document */}
          <Card className='gap-6'>
            <CardHeader className='gap-0 border-b [.border-b]:pb-4'>
              <CardTitle className='flex items-center gap-2'>
                <FileTextIcon className='size-5' />
                Submitted Document
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div className='flex items-center justify-between gap-4'>
                  <div className='flex items-center gap-3 flex-1 min-w-0'>
                    <div className='flex items-center justify-center size-10 rounded-lg bg-red-600/10 shrink-0'>
                      <FileTextIcon className='size-5 text-red-600' />
                    </div>
                    <div className='min-w-0'>
                      <p className='font-medium truncate'>Resume</p>
                      <p className='text-sm text-muted-foreground'>
                        PDF Document
                      </p>
                    </div>
                  </div>
                  <Button size='sm' variant='outline' asChild>
                    <a href={application.file} target='_blank'>
                      View
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className='space-y-6'>
          {/* Bio */}
          <Card className='gap-4'>
            <CardHeader className='gap-0 border-b [.border-b]:pb-4'>
              <CardTitle>Biography</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Bio */}
              <p className='text-muted-foreground leading-relaxed'>
                {application.bio}
              </p>
            </CardContent>
          </Card>

          {/* Social Links */}
          {application.socialLinks && (
            <Card className='gap-6'>
              <CardHeader className='gap-0 border-b [.border-b]:pb-4'>
                <CardTitle className='flex items-center gap-2'>
                  <GlobeIcon className='size-5' />
                  Social Links
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                {application.socialLinks.linkedin && (
                  <Link
                    href={application.socialLinks.linkedin}
                    target='_blank'
                    className='flex items-center gap-2 text-sm text-primary hover:underline'
                  >
                    <Badge variant='outline' className='w-20'>
                      LinkedIn
                    </Badge>
                    <span className='truncate'>
                      {application.socialLinks.linkedin}
                    </span>
                  </Link>
                )}
                {application.socialLinks.instagram && (
                  <Link
                    href={application.socialLinks.instagram}
                    target='_blank'
                    className='flex items-center gap-2 text-sm text-primary hover:underline'
                  >
                    <Badge variant='outline' className='w-20'>
                      Instagram
                    </Badge>
                    <span className='truncate'>
                      {application.socialLinks.instagram}
                    </span>
                  </Link>
                )}

                {application.socialLinks.whatsapp && (
                  <Link
                    href={application.socialLinks.whatsapp}
                    target='_blank'
                    className='flex items-center gap-2 text-sm text-primary hover:underline'
                  >
                    <Badge variant='outline' className='w-20'>
                      Whatsapp
                    </Badge>
                    <span className='truncate'>
                      {application.socialLinks.whatsapp}
                    </span>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}

          {/* Payments Details */}
          <Card className='gap-4'>
            <CardHeader className='gap-0 border-b [.border-b]:pb-4'>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <div className='flex flex-row gap-x-4 gap-y-2 items-center'>
                  <h3>Payout Eligibility:</h3>
                  <span
                    className={cn(
                      isPaymentEligible ? 'text-green-600' : 'text-red-500'
                    )}
                  >
                    {isPaymentEligible ? 'Eligible' : 'Not Eligible'}
                  </span>
                </div>
                {!isPaymentEligible && (
                  <p className='text-sm text-muted-foreground'>
                    The connected Stripe account is not eligible for payouts.{' '}
                    {account.requirements?.currently_due?.length} documents is
                    still required to enable payouts.
                  </p>
                )}
              </div>
              {!isPaymentEligible && (
                <div className='space-y-8'>
                  <div className='space-y-2'>
                    <h2>Missed Documents:</h2>
                    <ul className='space-y-2 min-w-0'>
                      {account.requirements?.currently_due?.map(
                        (requirement) => (
                          <li
                            key={requirement}
                            className='text-sm text-muted-foreground pl-2 break-words whitespace-normal'
                          >
                            {requirement}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <Button
                    size={'sm'}
                    className='rounded-full cursor-pointer text-xs'
                    onClick={() =>
                      startTransition(async () => {
                        await notifyApplicant(application.user.email);
                        toast.success(
                          'Notification sent to applicant successfully'
                        );
                      })
                    }
                  >
                    Notify Applicant
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      {application.status === 'pending' && (
        <div className='flex flex-col sm:flex-row gap-3 justify-end'>
          <Button
            variant='destructive'
            className='sm:w-auto w-full cursor-pointer'
            onClick={() => handleUpdateStatus('rejected')}
          >
            Reject Application
          </Button>

          <Button
            className='sm:w-auto w-full bg-green-600 hover:bg-green-700 cursor-pointer text-white'
            onClick={() => handleUpdateStatus('approved')}
            disabled={!isPaymentEligible}
          >
            Approve Application
          </Button>
        </div>
      )}
    </div>
  );
};

export default ViewApplicationDetails;
