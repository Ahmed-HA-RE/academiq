import ApplicationForm from '@/app/components/teach/ApplicationForm';
import { Metadata } from 'next';
import { getCurrentLoggedUser } from '@/lib/actions/user';
import { getApplicationByUserId } from '@/lib/actions/instructor/application';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Apply to Teach',
  description:
    'Join Academiq as an instructor and share your knowledge with a global audience. Create and sell courses on our platform.',
};

const ApplyPage = async () => {
  const user = await getCurrentLoggedUser();

  if (!user) return undefined;

  const application = await getApplicationByUserId(user.id);

  if (application) redirect('/application/status');

  return (
    <section>
      <div className='container'>
        <div className='flex items-center justify-center min-h-[50vh]'>
          <div className='w-full'>
            <ApplicationForm user={user} />

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
