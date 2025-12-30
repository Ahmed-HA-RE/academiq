import OrderDataTable from '@/app/components/admin/Orders/OrderDataTable';
import { loadSearchParams } from '@/lib/searchParams';
import { Metadata } from 'next';
import { SearchParams } from 'nuqs/server';
import { getAllOrdersAsAdmin } from '@/lib/actions/order';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Orders',
  description: 'Manage and review all orders in the admin dashboard.',
};

type AdminOrdersPageProps = {
  searchParams: Promise<SearchParams>;
};

const AdminOrderPage = async ({ searchParams }: AdminOrdersPageProps) => {
  const { q, status, page, paidAt } = await loadSearchParams(searchParams);

  const { orders, totalPages } = await getAllOrdersAsAdmin({
    q,
    status,
    page,
    paidAt,
  });

  return <OrderDataTable orders={orders} totalPages={totalPages} />;
};

export default AdminOrderPage;
