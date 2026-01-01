import DiscountsDataTable from '@/app/components/admin/Discount/DiscountsDataTable';
import { getAllDiscounts } from '@/lib/actions/discount';
import { loadSearchParams } from '@/lib/searchParams';
import { Metadata } from 'next';
import { SearchParams } from 'nuqs/server';

export const metadata: Metadata = {
  title: 'Discounts',
  description: 'Manage and view all discounts in the admin dashboard',
};

type AdminDiscountsPageProps = {
  searchParams: Promise<SearchParams>;
};

const AdminDiscountsPage = async ({
  searchParams,
}: AdminDiscountsPageProps) => {
  const { search, page, limit, type, expiry } =
    await loadSearchParams(searchParams);

  const { discounts, totalPages } = await getAllDiscounts({
    search,
    page,
    limit,
    type,
    expiry,
  });

  return <DiscountsDataTable discounts={discounts} totalPages={totalPages} />;
};

export default AdminDiscountsPage;
