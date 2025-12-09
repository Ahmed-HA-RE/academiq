import RegisterForm from '@/app/components/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create an Academiq account to access your courses and more.',
};

const RegisterPage = () => {
  return <RegisterForm />;
};

export default RegisterPage;
