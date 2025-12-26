import OrdersDataTable from '@/app/components/admin/OrdersTable';
import { getAllOrdersAsAdmin } from '@/lib/actions/order';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Orders',
  description: 'Manage and review all orders in the admin dashboard.',
};

const AdminOrdersPage = async () => {
  const orders = await getAllOrdersAsAdmin();

  return <OrdersDataTable orders={orders} />;
};

export default AdminOrdersPage;
