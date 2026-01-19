import {
  getActiveUsersCount,
  getMonthlyUserActivity,
  getNewUsersCount,
} from '@/lib/actions/admin/list-user';
import UsersChartDetails from './UsersChartDetails';

const UsersChart = async () => {
  const [newUsersCount, activeUsersCount, monthlyUserActivity] =
    await Promise.all([
      getNewUsersCount(),
      getActiveUsersCount(),
      getMonthlyUserActivity(),
    ]);

  return (
    <UsersChartDetails
      monthlyUserActivity={monthlyUserActivity}
      newUsersCount={newUsersCount}
      activeUsersCount={activeUsersCount}
    />
  );
};

export default UsersChart;
