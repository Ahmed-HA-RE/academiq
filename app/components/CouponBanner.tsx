'use client';
import { useState } from 'react';
import Stripe from 'stripe';

const CouponBanner = ({ activeCoupon }: { activeCoupon: Stripe.Coupon }) => {
  const [copied, setCopied] = useState(false);

  // Handle copy promo code
  const copyPromoCode = () => {
    navigator.clipboard.writeText(activeCoupon.name || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className='text-xs px-4 flex flex-row items-center justify-center gap-1 bg-gradient-to-r from-[#f11557] to-[#ffbd01] w-full py-2'>
      <p className='text-white'>
        Invest in Your Skills: Save up to{' '}
        {activeCoupon.percent_off
          ? activeCoupon.percent_off
          : (activeCoupon.amount_off as number) / 100}
        {activeCoupon?.percent_off ? '%' : 'AED'} -
      </p>
      <span onClick={copyPromoCode} className='text-white cursor-pointer'>
        {copied ? 'Copied!' : 'Copy Code'}
      </span>
    </div>
  );
};

export default CouponBanner;
