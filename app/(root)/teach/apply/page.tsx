import ApplicationForm from '@/app/components/teach/ApplicationForm';
import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getApplicationByUserId } from '@/lib/actions/instructor';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/app/components/ui/badge';
import { AlertCircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Apply to Teach',
  description:
    'Join Academiq as an instructor and share your knowledge with a global audience. Create and sell courses on our platform.',
};

const ApplyPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return undefined;

  const application = await getApplicationByUserId(session.user.id);

  return (
    <section>
      <div className='container'>
        <div className='flex items-center justify-center min-h-[50vh]'>
          <div className='w-full'>
            {application ? (
              <div className='h-full'>
                <Card className='max-w-xl mx-auto relative'>
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
                      <AlertCircleIcon className='size-3' />
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
                              ? '/teacher-dashboard'
                              : '/'
                        }
                      >
                        {application.status === 'pending'
                          ? 'Back To Home'
                          : application.status === 'approved'
                            ? 'Teacher Dashboard'
                            : 'Back To Home'}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <>
                <ApplicationForm user={session.user} />

                <p className='text-center text-sm text-muted-foreground mt-8'>
                  By submitting this form, you agree to our terms and
                  conditions.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplyPage;
