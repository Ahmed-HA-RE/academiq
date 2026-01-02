import ApplicationForm from '@/app/components/teach/ApplicationForm';
import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

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

  return (
    <section>
      <div className='container'>
        <div className='flex items-center justify-center min-h-[50vh]'>
          <div className='w-full'>
            <ApplicationForm user={session.user} />

            <p className='text-center text-sm text-muted-foreground mt-8'>
              By submitting this form, you agree to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplyPage;
