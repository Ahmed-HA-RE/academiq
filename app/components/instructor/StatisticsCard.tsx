import { BookMarkedIcon, DollarSignIcon, Users } from 'lucide-react';

import { Card, CardContent, CardHeader } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  getTotalCoursesByInstructor,
  getTotalRevenueByInstructor,
  getTotalStudentsCount,
} from '@/lib/actions/instructor/analytics';

const StatisticsCard = async () => {
  const [studentsCount, totalRevenue, totalCourses] = await Promise.all([
    getTotalStudentsCount(),
    getTotalRevenueByInstructor(),
    getTotalCoursesByInstructor(),
  ]);

  // Statistics card data
  const StatisticsCardData = [
    {
      icon: <Users />,
      title: 'Total Students',
      value: studentsCount,
      bg: 'bg-purple-500/10',
      color: 'text-purple-500',
    },
    {
      icon: <DollarSignIcon />,
      title: 'Total Revenue',
      value: `AED ${totalRevenue}`,
      bg: 'bg-green-500/10',
      color: 'text-green-500',
    },

    {
      icon: <BookMarkedIcon />,
      title: 'Total Courses',
      value: totalCourses,
      bg: 'bg-orange-400/10',
      color: 'text-orange-500',
    },
  ];
  return (
    <div className='max-w-7xl mx-auto w-full col-span-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4'>
        {StatisticsCardData.map((card, index) => (
          <Card
            key={index}
            className='py-4 hover:shadow-lg transition-shadow duration-300 gap-0'
          >
            <CardHeader className='flex items-center justify-between pb-2 px-4'>
              <span className='text-lg font-medium'>{card.title}</span>
              <Avatar className='size-9 rounded-md'>
                <AvatarFallback
                  className={`${card.bg} ${card.color} size-9 rounded-md [&>svg]:size-5`}
                >
                  {card.icon}
                </AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent className='flex flex-1 flex-col justify-between gap-2 '>
              <p className='flex flex-col gap-1'>
                <span className='text-xl sm:text-2xl font-bold'>
                  {card.value}
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StatisticsCard;
