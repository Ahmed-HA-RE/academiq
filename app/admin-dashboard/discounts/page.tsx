import DiscountsDataTable from '@/app/components/admin/Discount/DiscountsDataTable';
import { getAllDiscounts } from '@/lib/actions/discount';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Discounts',
  description: 'Manage and view all discounts in the admin dashboard',
};

const DiscountsPage = async () => {
  const discounts = await getAllDiscounts();

  return <DiscountsDataTable discounts={discounts} />;
};

export default DiscountsPage;
