'use client';

import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from '@/app/components/ui/card';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Rating } from '@/app/components/ui/rating';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Controller, useForm } from 'react-hook-form';
import { Course, CreateReview, Review, User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseReviewSchema } from '@/schema';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '../ui/field';
import Link from 'next/link';
import { SERVER_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  createReview,
  updateUserReview,
} from '@/lib/actions/course/review-mutation';
import { toast } from 'sonner';
import { Spinner } from '../ui/spinner';
import { Suspense, useState } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import { Alert, AlertTitle } from '../ui/alert';
import { CircleAlertIcon, TriangleAlert } from 'lucide-react';
import Pagination from '../shared/Pagination';

const ReviewDialog = ({
  review,
  courseId,
  user,
}: {
  review?: Review;
  courseId: string;
  user: User;
}) => {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateReview>({
    resolver: zodResolver(courseReviewSchema),
    defaultValues: review
      ? review
      : {
          rating: 0,
          approved: false,
          comment: '',
          courseId,
          userId: user.id,
        },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: CreateReview) => {
    if (!review) {
      const res = await createReview(courseId, data);

      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      setOpen(false);
    } else {
      const res = await updateUserReview(courseId, data);

      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type='button'
          className='w-full rounded-lg cursor-pointer bg-blue-500 hover:bg-blue-600 dark:bg-amber-500 dark:hover:bg-amber-600 text-white'
          disabled={!user.emailVerified}
        >
          {review ? 'Edit Your Review' : 'Write a Review'}
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-xl mt-6 text-left'>
            Share your experience with this course
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-4 pt-4'
        >
          <FieldSet>
            <FieldLegend className='text-foreground font-medium'>
              How would you describe your experience with this course?
            </FieldLegend>
            <FieldGroup className='gap-3'>
              <Controller
                name='rating'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Rating
                      value={Number(field.value)}
                      precision={0.5}
                      onValueChange={(value) =>
                        field.onChange(value.toString())
                      }
                      size={30}
                      variant='yellow'
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Comment */}
              <Controller
                name='comment'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Your Review</FieldLabel>
                    <Textarea
                      id={field.name}
                      className='input resize-none min-h-30'
                      placeholder='Type your comment here.'
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Approval */}
              <Controller
                name='approved'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation='horizontal'
                    data-invalid={fieldState.invalid}
                  >
                    <Checkbox
                      id={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className='dark:data-[state=checked]:bg-amber-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white size-4'
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldLabel className='text-sm' htmlFor={field.name}>
                      Publish my review.
                    </FieldLabel>
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>

          <DialogFooter className='sm:justify-end'>
            <DialogClose className='min-w-24 cursor-pointer' asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button
              disabled={form.formState.isSubmitting}
              className='cursor-pointer min-w-24'
              type='submit'
            >
              {form.formState.isSubmitting ? (
                <Spinner className='size-6' />
              ) : (
                'Submit'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const CourseReviews = ({
  user,
  course,
  review,
  reviews,
  totalPages,
  avgReviewRating,
}: {
  user: User | undefined;
  course: Course;
  review?: Review;
  reviews: Review[];
  avgReviewRating: string;
  totalPages: number;
}) => {
  const isInstructorViewing = course.instructor.userId === user?.id;

  return (
    <>
      <div
        className={cn(
          'grid grid-cols-1 gap-6 mb-4',
          !isInstructorViewing && 'md:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {reviews.length === 0 ? (
          <Alert className='lg:col-span-2 self-start max-w-md'>
            <CircleAlertIcon />
            <AlertTitle>
              No reviews have been published for this course yet!
            </AlertTitle>
          </Alert>
        ) : (
          <div
            className={cn('space-y-8', !isInstructorViewing && 'lg:col-span-2')}
          >
            <h2 className='text-3xl font-semibold'>What Students Say</h2>
            {reviews?.map((review) => (
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
                        <h5 className='text-lg font-semibold'>
                          {review.user.name}
                        </h5>
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
            ))}
          </div>
        )}

        {!isInstructorViewing && (
          <div className='space-y-6'>
            <h2 className='text-3xl font-semibold'>Average Rating</h2>
            <Card className='w-full shadow-none'>
              <CardHeader>
                <CardTitle className='flex reviews-center gap-3 text-3xl font-semibold'>
                  {avgReviewRating.toString()}
                  <span>
                    <Rating
                      readOnly
                      variant='yellow'
                      size={24}
                      value={Number(avgReviewRating)}
                      precision={0.5}
                    />
                  </span>
                </CardTitle>
                <CardDescription>
                  Average Positive rating on this year
                </CardDescription>
              </CardHeader>

              <CardFooter className='flex-col items-start gap-4'>
                <h5 className='text-lg font-semibold'>Write your Review</h5>
                <p className='text-muted-foreground'>
                  Share your feedback and help create a better learning
                  experience for everyone
                </p>
                {user ? (
                  <ReviewDialog
                    user={user}
                    courseId={course.id}
                    review={review}
                  />
                ) : (
                  <Button
                    type='button'
                    className='w-full rounded-lg cursor-pointer bg-blue-500 hover:bg-blue-600 dark:bg-amber-500 dark:hover:bg-amber-500/80 text-white'
                    asChild
                  >
                    <Link
                      href={`/login?callbackUrl=${SERVER_URL}/course/${course.slug}`}
                    >
                      Write a Review
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
            {user && !user.emailVerified && (
              <Alert className='border-destructive bg-destructive/10 text-destructive rounded-none border-0 border-l-6'>
                <TriangleAlert />
                <AlertTitle>
                  Please verify your email to write a review.
                </AlertTitle>
              </Alert>
            )}
          </div>
        )}
      </div>
      {totalPages > 1 && <Pagination totalPages={totalPages} />}
    </>
  );
};

export default CourseReviews;
