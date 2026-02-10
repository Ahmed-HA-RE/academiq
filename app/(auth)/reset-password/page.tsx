import ResetPasswordForm from '@/app/components/auth/ResetPasswordForm';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your Academiq account password.',
};

const ResetPasswordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { token } = await searchParams;

  if (!token) {
    return redirect('/forgot-password');
  }

  return <ResetPasswordForm token={token} />;
};

export default ResetPasswordPage;
