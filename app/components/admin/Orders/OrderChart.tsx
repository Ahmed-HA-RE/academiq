import { getOrdersMonthlyRevenue } from '@/lib/actions/order';
import OrderChartDetails from './OrderChartDetails';

const OrderChart = async () => {
  const ordersMonthlyRevenue = await getOrdersMonthlyRevenue();
  return <OrderChartDetails ordersMonthlyRevenue={ordersMonthlyRevenue} />;
};

export default OrderChart;
