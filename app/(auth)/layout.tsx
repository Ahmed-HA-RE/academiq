import AuthLines from '../components/auth/auth-lines';
import { Card, CardContent } from '../components/ui/card';
import DynamicCardHeader from '../components/auth/DynamicCardHeader';

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className='bg-muted flex h-auto min-h-screen items-center justify-center px-4 py-12 relative'>
      <Card className='relative w-full max-w-md overflow-hidden border-none pt-8 gap-3 shadow-lg'>
        <div className='to-primary/10 pointer-events-none absolute top-0 h-52 w-full rounded-t-xl bg-gradient-to-t from-transparent'></div>

        <AuthLines className='pointer-events-none absolute inset-0 top-0' />

        <DynamicCardHeader />

        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
};

export default AuthLayout;
