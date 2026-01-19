import ApplicationForm from '@/app/components/teach/ApplicationForm';
import { Metadata } from 'next';
import { getCurrentLoggedUser } from '@/lib/actions/user/getUser';
import { getApplicationByUserId } from '@/lib/actions/instructor/application';
import { redirect } from 'next/navigation';
import ApplicationStepper from '@/app/components/teach/ApplicationStepper';

export const metadata: Metadata = {
  title: 'Apply to Teach',
  description:
    'Join Academiq as an instructor and share your knowledge with a global audience. Create and sell courses on our platform.',
};

const ApplyPage = async () => {
  const [user, application] = await Promise.all([
    getCurrentLoggedUser(),
    getApplicationByUserId(),
  ]);

  if (!user) redirect('/');
  if (application) redirect('/teach');

  return (
    <section className='section-spacing'>
      <div className='container'>
        {/* Header Section */}
        <div className='text-center mb-8 md:mb-12'>
          <h1 className='text-3xl md:text-4xl font-bold mb-3'>
            Become an Instructor
          </h1>
          <p className='text-base md:text-lg text-muted-foreground max-w-2xl mx-auto'>
            Fill out the form below to start your teaching journey
          </p>
        </div>

        {/* Stepper Section */}
        <div className='mb-8 md:mb-12'>
          <ApplicationStepper currentStep={1} />
        </div>

        {/* Main Content Card */}
        <div className='mx-auto max-w-5xl'>
          <div className='rounded-2xl bg-card shadow-lg border p-6 md:p-8 lg:p-12'>
            <ApplicationForm user={user} />

            <p className='text-center text-sm text-muted-foreground mt-8 pt-6 border-t'>
              By submitting this form, you agree to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplyPage;
