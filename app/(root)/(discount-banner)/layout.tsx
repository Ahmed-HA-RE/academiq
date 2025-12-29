import CouponBanner from '@/app/components/CouponBanner';
import { getValidDiscount } from '@/lib/actions/discount';

const DiscountBannerLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const discount = await getValidDiscount();

  return (
    <>
      {discount && <CouponBanner discount={discount} />}
      {children}
    </>
  );
};

export default DiscountBannerLayout;
