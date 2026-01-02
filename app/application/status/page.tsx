import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { getApplicationByUserId } from '@/lib/actions/instructor/instructor';
import { getCurrentLoggedUser } from '@/lib/actions/user';
import { APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Application Status',
  description: 'Check the status of your application',
};

const ApplicationStatusPage = async () => {
  const user = await getCurrentLoggedUser();

  if (!user) redirect('/');

  const application = await getApplicationByUserId(user.id);

  if (!application) redirect('/instructor-dashboard/apply');

  return (
    <div className='min-h-screen w-screen flex items-center justify-center px-4'>
      <Card className='max-w-xl mx-auto w-full relative'>
        <CardHeader className='items-center justify-center mt-6'>
          <Image
            src={`/svg/${application.status}.svg`}
            alt={`Application ${application.status}`}
            width={80}
            height={80}
            className='mx-auto mb-6'
          />

          <Badge
            variant='outline'
            className={cn(
              'rounded-sm absolute top-4 right-4',
              application.status === 'pending'
                ? 'border-amber-400 text-amber-400'
                : application.status === 'approved'
                  ? 'border-green-600 text-green-600'
                  : 'border-red-600 text-red-600'
            )}
          >
            {application.status === 'pending' ||
            application.status === 'rejected' ? (
              <AlertCircleIcon className='size-3' />
            ) : (
              application.status === 'approved' && (
                <CheckCircleIcon className='size-3' />
              )
            )}
            {application.status === 'pending'
              ? 'Under Review'
              : application.status.charAt(0).toUpperCase() +
                application.status.slice(1)}
          </Badge>
          <CardTitle className='text-center font-bold text-2xl sm:text-3xl'>
            {application.status === 'pending'
              ? 'Your application is under review.'
              : application.status === 'approved'
                ? 'Congratulations! Your application has been approved.'
                : 'We regret to inform you that your application has been rejected.'}
          </CardTitle>
          <CardDescription className='text-center text-muted-foreground text-sm md:text-base'>
            {application.status === 'pending'
              ? "Your application has been successfully submitted and is currently being reviewed by our team. This process may take a few days. We'll notify you once there's an update."
              : application.status === 'approved'
                ? `Thank you for applying to be an instructor at Academiq. We are excited to have you on board! You can now start creating and publishing your courses on our platform. Welcome to the ${APP_NAME} community!`
                : 'Thank you for your interest in becoming an instructor at Academiq. After careful consideration, we regret to inform you that your application has not been successful at this time. We encourage you to review our instructor guidelines and consider reapplying in the future.'}
          </CardDescription>
        </CardHeader>
        <CardFooter className='justify-center'>
          <Button asChild>
            <Link
              href={
                application.status === 'pending'
                  ? '/'
                  : application.status === 'approved'
                    ? '/instructor-dashboard'
                    : '/'
              }
            >
              {application.status === 'pending'
                ? 'Back To Home'
                : application.status === 'approved'
                  ? 'Instructor Dashboard'
                  : 'Back To Home'}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApplicationStatusPage;
