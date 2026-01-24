import { Review } from '@/types';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Suspense } from 'react';
import Image from 'next/image';
import { Rating } from '../ui/rating';
import { format } from 'date-fns';

const UserCourseReview = ({ review }: { review: Review }) => {
  return (
    <div key={`${review}-${review.id}`}>
      <Card className=' shadow-none'>
        <CardContent className='space-y-3'>
          <div className='flex gap-3'>
            <Avatar className='size-10'>
              <Suspense
                fallback={
                  <AvatarFallback className='text-xs'>
                    {review.user.name}
                  </AvatarFallback>
                }
              >
                <Image
                  alt={review.user.name}
                  src={review.user.image}
                  width={40}
                  height={40}
                />
              </Suspense>
            </Avatar>
            <div className='flex grow flex-col'>
              <h5 className='text-lg font-semibold'>{review.user.name}</h5>
              <span className='text-muted-foreground font-medium'>
                {format(new Date(review.createdAt), 'M/d/yyyy')}
              </span>
            </div>
            <Rating
              readOnly
              variant='yellow'
              size={16}
              value={review.rating}
              precision={0.5}
            />
          </div>
          <p className='text-muted-foreground'>{review.comment}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserCourseReview;
