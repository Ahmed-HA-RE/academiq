import ApplicationForm from '@/app/components/teacher/ApplicationForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apply to Teach',
  description:
    'Join Academiq as an instructor and share your knowledge with a global audience. Create and sell courses on our platform.',
};

const ApplyPage = () => {
  return (
    <section>
      <div className='container'>
        <div className='flex items-center justify-center'>
          <div className='w-full'>
            {/* Form  */}
            <ApplicationForm />
            {/* Footer Note */}
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
