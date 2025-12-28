import LoginForm from '@/app/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description:
    'Login to your Academiq account to access your courses and more.',
};

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const { callbackUrl } = (await searchParams) || '/';

  return <LoginForm callbackUrl={callbackUrl} />;
};

export default LoginPage;
