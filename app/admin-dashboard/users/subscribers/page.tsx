import SubscriberDataTable from '@/app/components/admin/Users/SubscriberDataTable';
import { listSubscribers } from '@/lib/actions/admin/list-subscribers';
import { loadSearchParams } from '@/lib/searchParams';
import { Metadata } from 'next';
import { SearchParams } from 'nuqs';

export const metadata: Metadata = {
  title: 'Subscribers',
  description: 'Manage and view all subscribers in the admin dashboard.',
};

const SubscribersPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { status, search, limit, page } = await loadSearchParams(searchParams);

  const { subscribers, totalPages } = await listSubscribers({
    status,
    search,
    limit,
    page,
  });
  return (
    <SubscriberDataTable subscribers={subscribers} totalPages={totalPages} />
  );
};

export default SubscribersPage;
