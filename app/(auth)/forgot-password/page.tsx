import ForgotPasswordForm from '@/app/components/auth/ForgotPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description:
    'Reset your password by entering your email to receive a verification code.',
};

const ForgotPasswordPage = () => {
  return <ForgotPasswordForm />;
};

export default ForgotPasswordPage;
