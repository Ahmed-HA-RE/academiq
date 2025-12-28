import OrdersDataTable from '@/app/components/admin/Orders/OrdersTable';
import { getAllOrdersAsAdmin } from '@/lib/actions/order';
import { loadSearchParams } from '@/lib/searchParams';
import { Metadata } from 'next';
import { SearchParams } from 'nuqs/server';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Orders',
  description: 'Manage and review all orders in the admin dashboard.',
};

type AdminOrdersPageProps = {
  searchParams: Promise<SearchParams>;
};

const AdminOrdersPage = async ({ searchParams }: AdminOrdersPageProps) => {
  const { q, status, page, paidAt } = await loadSearchParams(searchParams);

  const { orders, totalPages } = await getAllOrdersAsAdmin({
    q,
    status,
    paidAt,
    page,
  });

  return <OrdersDataTable orders={orders} totalPages={totalPages} />;
};

export default AdminOrdersPage;
