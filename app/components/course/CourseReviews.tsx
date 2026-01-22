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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/components/ui/avatar';
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
import { CreateReview, Review } from '@/types';
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

const reviewsData = [
  {
    id: 1,
    image: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-13.png',
    name: 'Zain Saris',
    rating: 4.5,
    date: '11-11-2023',
    description:
      'I absolutely love this smartwatch! It tracks my steps, heart rate, and even sleep patterns with great accuracy. The design is sleek and lightweight, making it comfortable to wear all day. The battery lasts several days, and the notifications from my phone come through perfectly.',
  },
  {
    id: 2,
    image: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-15.png',
    name: 'Erin Torff',
    rating: 4.5,
    date: '11-11-2023',
    description:
      "This portable blender is a game changer! It's compact, easy to use, and powerful enough to blend smoothies, protein shakes, and even ice. The rechargeable battery lasts a long time, making it perfect for on-the-go use.",
  },
  {
    id: 3,
    image: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png',
    name: 'Wilson Workman',
    rating: 4.5,
    date: '11-11-2023',
    description:
      "I'm so impressed with this LED desk lamp! It has multiple brightness settings and an adjustable arm, making it perfect for reading, studying, or working late at night. The touch controls are super convenient, and the light is easy on the eyes.",
  },
];

const ReviewDialog = ({
  review,
  courseId,
  userId,
}: {
  review?: Review;
  courseId: string;
  userId?: string;
}) => {
  const form = useForm<CreateReview>({
    resolver: zodResolver(courseReviewSchema),
    defaultValues: review
      ? review
      : {
          rating: 0,
          approved: false,
          comment: '',
          courseId,
          userId,
        },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: CreateReview) => {
    console.log(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type='button'
          className='w-full rounded-lg cursor-pointer bg-blue-500 hover:bg-blue-600 dark:bg-amber-500 dark:hover:bg-amber-600 text-white'
        >
          Write a Review
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
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button className='cursor-pointer' type='submit'>
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const CourseReviews = ({
  userId,
  course,
}: {
  userId: string | undefined;
  course: {
    id: string;
    slug: string;
  };
}) => {
  return (
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
      <div className='space-y-8 lg:col-span-2'>
        <h2 className='text-3xl font-semibold'>What Students Say</h2>
        {reviewsData.map((item) => (
          <div key={`${item.name}-${item.id}`}>
            <Card className='w-full shadow-none'>
              <CardContent className='space-y-3'>
                <div className='flex gap-3'>
                  <Avatar className='size-10'>
                    <AvatarImage src={item.image} alt={item.name} />
                    <AvatarFallback className='text-xs'>
                      {item.name}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex grow flex-col'>
                    <h5 className='text-lg font-semibold'>{item.name}</h5>
                    <span className='text-muted-foreground font-medium'>
                      {item.date}
                    </span>
                  </div>
                  <Rating
                    readOnly
                    variant='yellow'
                    size={16}
                    value={item.rating}
                    precision={0.5}
                  />
                </div>
                <p className='text-muted-foreground'>{item.description}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className='space-y-8'>
        <h2 className='text-3xl font-semibold'>Average Rating</h2>
        <Card className='w-full shadow-none'>
          <CardHeader>
            <CardTitle className='flex items-center gap-3 text-3xl font-semibold'>
              4.5
              <span>
                <Rating
                  readOnly
                  variant='yellow'
                  size={24}
                  value={4.5}
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
              Share your feedback and help create a better learning experience
              for everyone
            </p>
            {userId ? (
              <ReviewDialog userId={userId} courseId={course.id} />
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
      </div>
    </div>
  );
};

export default CourseReviews;
