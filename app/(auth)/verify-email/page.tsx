import OTPVerificationForm from '@/app/components/auth/OTPVerificationForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Email',
  description: 'Verify your email for your Academiq account.',
};

const VerifyEmailPage = () => {
  return <OTPVerificationForm />;
};

export default VerifyEmailPage;
