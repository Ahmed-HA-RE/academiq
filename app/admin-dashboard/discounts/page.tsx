import DiscountsDataTable from '@/app/components/admin/Discount/DiscountsDataTable';
import { getAllDiscounts } from '@/lib/actions/discount';
import { loadSearchParams } from '@/lib/searchParams';
import { Metadata } from 'next';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Discounts',
  description: 'Manage and view all discounts in the admin dashboard',
};

type DiscountsPageProps = {
  searchParams: Promise<SearchParams>;
};

const DiscountsPage = async ({ searchParams }: DiscountsPageProps) => {
  const { search, page, limit, type, expiry } =
    await loadSearchParams(searchParams);

  const { discounts, totalPages } = await getAllDiscounts({
    search,
    page,
    limit,
    type,
    expiry,
  });

  return (
    <Suspense fallback={<div>Loading discounts...</div>}>
      <DiscountsDataTable discounts={discounts} totalPages={totalPages} />
    </Suspense>
  );
};

export default DiscountsPage;
