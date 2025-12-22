import {
  BookMarkedIcon,
  Box,
  DollarSignIcon,
  FileUser,
  GraduationCap,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { getUsersCount } from '@/lib/actions/user';
import { getOrdersCount, getTotalSalesAmount } from '@/lib/actions/order';
import {
  getInstructorApplicationsCount,
  getTotalInstructorsCount,
} from '@/lib/actions/instructor';
import { getTotalCoursesCount } from '@/lib/actions/course';

const StatisticsCard = async () => {
  const [
    usersCount,
    ordersCount,
    totalSalesAmount,
    totalInstructors,
    totalInstructorsApplicants,
    totalCourses,
  ] = await Promise.all([
    getUsersCount(),
    getOrdersCount(),
    getTotalSalesAmount(),
    getTotalInstructorsCount(),
    getInstructorApplicationsCount(),
    getTotalCoursesCount(),
  ]);

  // Statistics card data
  const StatisticsCardData = [
    {
      icon: <Users />,
      title: 'Total Users',
      value: usersCount,
      bg: 'bg-purple-500/10',
      color: 'text-purple-500',
    },
    {
      icon: <Box />,
      title: 'Total Orders',
      value: ordersCount,
      bg: 'bg-pink-500/10',
      color: 'text-pink-500',
    },
    {
      icon: <DollarSignIcon />,
      title: 'Total Revenue',
      value: `AED ${totalSalesAmount}`,
      bg: 'bg-green-500/10',
      color: 'text-green-500',
    },
    {
      icon: <GraduationCap />,
      title: 'Total Instructors',
      value: totalInstructors,
      bg: 'bg-yellow-500/10',
      color: 'text-yellow-500',
    },
    {
      icon: <BookMarkedIcon />,
      title: 'Total Courses',
      value: totalCourses,
      bg: 'bg-orange-400/10',
      color: 'text-orange-500',
    },
    {
      icon: <FileUser />,
      title: 'Total Applicants',
      value: totalInstructorsApplicants,
      bg: 'bg-blue-500/10',
      color: 'text-blue-500',
    },
  ];
  return (
    <div className='max-w-7xl mx-auto w-full md:col-span-3'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {StatisticsCardData.map((card, index) => (
          <Card
            key={index}
            className='gap-4 py-4 hover:shadow-lg transition-shadow duration-300'
          >
            <CardHeader className='flex items-center justify-between pb-2'>
              <Avatar className='size-10 sm:size-11 rounded-md'>
                <AvatarFallback
                  className={`${card.bg} ${card.color} size-10 sm:size-11 shrink-0 rounded-md [&>svg]:size-5`}
                >
                  {card.icon}
                </AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent className='flex flex-1 flex-col justify-between gap-2'>
              <p className='flex flex-col gap-1'>
                <span className='text-xl sm:text-2xl font-bold'>
                  {card.value}
                </span>
                <span className='text-sm sm:text-base font-medium text-muted-foreground'>
                  {card.title}
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
