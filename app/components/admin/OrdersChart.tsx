'use client';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/app/components/ui/chart';

const totalIncomeChartConfig = {
  incomes: {
    label: 'Incomes',
  },
} satisfies ChartConfig;

type OrdersChartProps = {
  ordersMonthlyRevenue: {
    month: string;
    revenue: number;
    totalPrice: number;
  }[];
};

const OrdersChart = ({ ordersMonthlyRevenue }: OrdersChartProps) => {
  const maxRevenue = Math.max(...ordersMonthlyRevenue.map((o) => o.totalPrice));

  return (
    <Card className={'col-span-4 gap-6 py-0 xl:grid-cols-4'}>
      <div className='space-y-4 py-6 max-lg:border-b lg:col-span-2 lg:border-r'>
        <CardHeader>
          <CardTitle className='text-2xl font-semibold'>Orders</CardTitle>
          <span className='text-muted-foreground text-sm'>
            Monthly orders overview
          </span>
        </CardHeader>
        <CardContent className='pb-0 px-6 '>
          <ChartContainer
            config={totalIncomeChartConfig}
            className='min-h-[300px] max-h-[300px] w-full '
          >
            <AreaChart
              data={ordersMonthlyRevenue}
              margin={{
                left: 10,
                right: 12,
                top: 12,
                bottom: 12,
              }}
              className='stroke-2'
            >
              <defs>
                <linearGradient id='fillSales' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='20%'
                    stopColor='var(--chart-2)'
                    stopOpacity={1}
                  />
                  <stop
                    offset='80%'
                    stopColor='var(--chart-2)'
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray='3'
                stroke='var(--border)'
                vertical={false}
              />
              <XAxis
                dataKey='month'
                tickLine={false}
                tickMargin={5.5}
                axisLine={false}
                tickFormatter={(value, index) =>
                  index % 2 === 0 ? value.slice(0, 3) : ''
                }
                tick={{ fontSize: 12 }}
              />
              <YAxis
                domain={[0, Math.ceil(maxRevenue / 1000) * 1000]}
                tickFormatter={(value) =>
                  value >= 1000
                    ? `AED ${(value / 1000).toFixed(1)}k`
                    : `AED ${value}`
                }
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 12,
                  fill: 'var(--muted-foreground)',
                  width: 100,
                }}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value) => [
                      `$${((value as number) / 1000).toFixed(1)}k`,
                      ' Income',
                    ]}
                  />
                }
              />
              <Area
                dataKey='totalPrice'
                type='linear'
                fill='url(#fillSales)'
                stroke='var(--chart-2)'
                stackId='a'
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </div>
    </Card>
  );
};

export default OrdersChart;
