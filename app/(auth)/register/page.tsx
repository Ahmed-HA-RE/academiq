import RegisterForm from '@/app/components/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create an Academiq account to access your courses and more.',
};

const RegisterPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { callbackUrl } = await searchParams;

  return <RegisterForm callbackUrl={callbackUrl || '/'} />;
};

export default RegisterPage;
