'use client';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
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
    label: 'Active Users',
    color: 'var(--chart-1)',
  },
  pv: {
    label: 'New Users',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

type UsersChartProps = {
  monthlyUserActivity: {
    name: string;
    uv: number;
    pv: number;
  }[];
  activeUsersCount: number;
  newUsersCount: number;
};

const UsersChart = ({
  monthlyUserActivity,
  newUsersCount,
  activeUsersCount,
}: UsersChartProps) => {
  // Calculate max value for Y-axis domain
  const maxValue = Math.max(
    ...monthlyUserActivity.map((d) => Math.max(d.pv, d.uv))
  );
  const yAxisMax = Math.ceil(maxValue / 10) * 10 || 100;

  return (
    <Card className='col-span-4 xl:col-span-2 w-full gap-2'>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold'>User Activity</CardTitle>
      </CardHeader>
      <CardContent className='pb-4 px-6'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex flex-col gap-1'>
            <span className='text-sm text-muted-foreground'>Active Users</span>
            <span className='text-2xl font-bold text-center'>
              {activeUsersCount}
            </span>
          </div>
          <div className='flex flex-col gap-1 text-right'>
            <span className='text-sm text-muted-foreground'>New Users</span>
            <span className='text-2xl font-bold text-center'>
              {newUsersCount}
            </span>
          </div>
        </div>
        <ChartContainer
          className='min-h-[400px] w-full'
          config={totalEarningChartConfig}
        >
          <BarChart
            data={monthlyUserActivity}
            margin={{ top: 5, right: 0, left: -15, bottom: 5 }}
            barGap={4}
            barSize={16}
          >
            <CartesianGrid vertical={false} stroke='var(--border)' />
            <XAxis
              dataKey='name'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={[0, yAxisMax]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                value > 999 ? `${value / 1000}k` : value
              }
              tick={{ fontSize: 12 }}
              width={50}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dashed' />}
            />
            <ChartLegend
              content={<ChartLegendContent />}
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Bar dataKey='uv' fill='var(--chart-1)' radius={[4, 4, 0, 0]} />
            <Bar dataKey='pv' fill='var(--chart-2)' radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default UsersChart;
