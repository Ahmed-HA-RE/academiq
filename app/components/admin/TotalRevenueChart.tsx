'use client';
import { CircleDollarSignIcon, WalletIcon } from 'lucide-react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/app/components/ui/chart';

const totalEarningChartConfig = {
  uv: {
    label: (new Date().getFullYear() - 1).toString(),
    color: 'var(--chart-1)',
  },
  pv: {
    label: new Date().getFullYear(),
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

type TotalRevenueChartProps = {
  monthlyRevenue: {
    name: string;
    uv: number;
    pv: number;
    amt: number;
  }[];
  totalRevenueBefore: number;
  totalRevenueAfter: number;
};

const TotalRevenueChart = ({
  monthlyRevenue,
  totalRevenueBefore,
  totalRevenueAfter,
}: TotalRevenueChartProps) => {
  // Calculate growth percentage
  const growthPercentage =
    totalRevenueBefore === 0
      ? 0
      : Math.round(
          (totalRevenueAfter - totalRevenueBefore) / totalRevenueBefore
        );

  return (
    <Card className='col-span-4 xl:col-span-2 w-full'>
      <CardHeader className='flex flex-col md:flex-col items-start justify-between gap-4 pb-4'>
        <span className='text-2xl font-semibold'>Total Revenue</span>
        <div className='flex items-center gap-4'>
          {/* Last Year */}
          <div className='flex items-center gap-2'>
            <Avatar className='size-9 rounded-sm'>
              <AvatarFallback className='bg-chart-1/10 text-chart-1 shrink-0 rounded-sm'>
                <WalletIcon className='size-4' />
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col gap-0.5'>
              <span className='text-muted-foreground text-xs'>
                {new Date().getFullYear() - 1}
              </span>
              <div className='flex flex-row items-center gap-1 font-semibold'>
                <span className='dirham-symbol !text-sm'>&#xea;</span>
                <span className='text-sm'>{totalRevenueBefore}</span>
              </div>
            </div>
          </div>
          {/* This Year */}
          <div className='flex items-center gap-2'>
            <Avatar className='size-9 rounded-sm'>
              <AvatarFallback className='bg-chart-2/10 text-chart-2 shrink-0 rounded-sm'>
                <CircleDollarSignIcon className='size-4' />
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col items-start gap-0.5'>
              <span className='text-muted-foreground text-xs'>
                {new Date().getFullYear()}
              </span>
              <div className='flex flex-row items-center gap-1 font-semibold'>
                <span className='dirham-symbol !text-sm'>&#xea;</span>
                <span className='text-sm'>{totalRevenueAfter}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className='pb-4 px-6'>
        <div className='flex items-center justify-between mb-4'>
          <span className='text-muted-foreground text-sm'>
            {growthPercentage}% Company Growth
          </span>
        </div>
        <ChartContainer
          className='min-h-[200px] max-h-[300px] w-full'
          config={totalEarningChartConfig}
        >
          <LineChart
            data={monthlyRevenue}
            margin={{ top: 5, right: 10, left: -40, bottom: 5 }}
          >
            <CartesianGrid
              vertical={false}
              stroke='var(--border)'
              opacity={100}
            />
            <XAxis
              dataKey='name'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value, index) =>
                index % 2 === 0 ? value.slice(0, 3) : ''
              }
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => (value === 0 ? '0' : `${value}k`)}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={<ChartTooltipContent indicator='line' />}
            />
            <ChartLegend
              content={<ChartLegendContent />}
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Line
              type='monotone'
              dataKey='uv'
              stroke='var(--chart-1)'
              strokeWidth={3}
              dot={false}
            />
            <Line
              type='monotone'
              dataKey='pv'
              stroke='var(--chart-2)'
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TotalRevenueChart;
