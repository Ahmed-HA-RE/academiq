import OTPVerificationForm from '@/app/components/auth/OTPVerificationForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Email',
  description: 'Verify your email for your Academiq account.',
};

const VerifyEmailPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { callbackUrl } = await searchParams;

  return <OTPVerificationForm callbackUrl={callbackUrl || '/'} />;
};

export default VerifyEmailPage;
