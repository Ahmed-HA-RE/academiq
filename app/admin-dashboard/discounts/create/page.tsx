import CreateUpdateDiscountForm from '@/app/components/admin/Discount/CreateDiscountForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Create Discount Code',
  description: 'Create a new discount code in the admin dashboard',
};

const CreateDiscountPage = () => {
  return <CreateUpdateDiscountForm />;
};

export default CreateDiscountPage;
