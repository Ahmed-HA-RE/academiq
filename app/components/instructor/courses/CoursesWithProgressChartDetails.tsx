'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../../ui/chart';

const progressChartConfig = {
  entries: {
    label: 'Entries',
  },
} satisfies ChartConfig;

const CoursesWithProgressChartDetails = ({
  results,
}: {
  results: {
    range: string;
    entries: number;
  }[];
}) => {
  const maxStudents = Math.max(...results.map((r) => r.entries));

  return (
    <Card className='col-span-4 gap-6 py-0'>
      <div className='space-y-4 py-6 max-lg:border-b lg:col-span-2 '>
        <CardHeader>
          <CardTitle className='text-2xl font-semibold'>
            Progress Percentage by Students
          </CardTitle>
          <span className='text-muted-foreground text-sm'>
            Track course completion
          </span>
        </CardHeader>
        <CardContent className='pb-0 px-6 '>
          <ChartContainer
            config={progressChartConfig}
            className='min-h-[300px] max-h-[300px] w-full '
          >
            <AreaChart
              data={results}
              margin={{
                left: -15,
                right: 12,
                top: 12,
                bottom: 12,
              }}
              className='stroke-2'
            >
              <defs>
                <linearGradient id='fillProgress' x1='0' y1='0' x2='0' y2='1'>
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
                dataKey='range'
                tickLine={false}
                tickMargin={5.5}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                domain={[0, Math.ceil(maxStudents / 10) * 10]}
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
                content={<ChartTooltipContent hideLabel />}
              />
              <Area
                dataKey='entries'
                type='linear'
                fill='url(#fillProgress)'
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

export default CoursesWithProgressChartDetails;
