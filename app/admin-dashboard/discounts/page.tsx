import DiscountsDataTable from '@/app/components/admin/DiscountsDataTable';
import { getAllDiscounts } from '@/lib/actions/discount';

const DiscountsPage = async () => {
  const discounts = await getAllDiscounts();

  return <DiscountsDataTable discounts={discounts} />;
};

export default DiscountsPage;
