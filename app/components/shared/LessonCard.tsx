'use client';

import { CreateCourse, Lesson } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Button } from '../ui/button';
import { deleteCourseLessons } from '@/lib/actions/course/courseDeletion';
import { CircleX, Grip, RefreshCw, Video } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import MuxPlayer from '@mux/mux-player-react';
import { UploadDropzone } from '@/lib/uploadthing';
import { Alert, AlertTitle } from '../ui/alert';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

type LessonCardProps = {
  lesson: Omit<Lesson, 'status' | 'sectionId' | 'createdAt' | 'muxData'>;
  sectionIndex: number;
  lessonIndex: number;
  lessons: Lesson[] | undefined;
  form: UseFormReturn<CreateCourse>;
  remove: (index: number) => void;
};

const LessonCard = ({
  lesson,
  lessons,
  sectionIndex,
  lessonIndex,
  form,
  remove,
}: LessonCardProps) => {
  const pathname = usePathname();

  const [isUpdatingVideo, setIsUpdatingVideo] = useState<number | null>(null);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} className='border-0 shadow-sm gap-3'>
      <CardHeader className='px-2 !flex items-center gap-1'>
        <Button
          variant='ghost'
          size='icon-sm'
          className='cursor-move p-0 hover:bg-0'
          {...attributes}
          {...listeners}
        >
          <Grip className='size-5' />
        </Button>
        <CardTitle className='text-slate-500 dark:text-slate-400'>
          Order: {lesson.position}
        </CardTitle>
      </CardHeader>
      <CardContent className='px-4'>
        <FieldGroup className='gap-5'>
          <Controller
            name={`sections.${sectionIndex}.lessons.${lessonIndex}.title`}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className='flex flex-row items-center justify-between'>
                  <FieldLabel htmlFor={field.name}>Title:</FieldLabel>
                  <Button
                    type='button'
                    variant={'ghost'}
                    size={'icon-sm'}
                    className='cursor-pointer hover:bg-0 p-0'
                    onClick={async () => {
                      remove(lessonIndex);
                      if (lessons?.[lessonIndex]?.id) {
                        await deleteCourseLessons(lessons?.[lessonIndex]?.id);
                      }
                    }}
                  >
                    <CircleX className='size-5' />
                  </Button>
                </div>
                <Input
                  id={field.name}
                  placeholder='e.g Lesson 1: Introduction...'
                  className='input border-black dark:border-white/50 placeholder:text-black dark:placeholder:text-white/50 text-sm'
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name={`sections.${sectionIndex}.lessons.${lessonIndex}.duration`}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className='flex flex-row items-center justify-between'>
                  <FieldLabel htmlFor={field.name}>Duration:</FieldLabel>
                  <span className='text-muted-foreground text-sm'>
                    (minutes)
                  </span>
                </div>
                <Input
                  id={field.name}
                  type='number'
                  min={0}
                  step={0.5}
                  placeholder='Duration in minutes'
                  className='input border-black dark:border-white/50 placeholder:text-black dark:placeholder:text-white/50 text-sm'
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {lessons && lessons[lessonIndex]?.muxData?.muxPlaybackId ? (
            <div>
              <span className='flex flex-row items-center justify-between mb-2'>
                <Label className='my-4'>
                  <Video className='size-5' />
                  Video
                </Label>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='text-xs hover:bg-blue-50 dark:hover:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 gap-2 cursor-pointer'
                  onClick={() => setIsUpdatingVideo(lessonIndex)}
                >
                  <RefreshCw className='size-3' />
                  Update Video
                </Button>
              </span>
              <MuxPlayer
                className='w-full aspect-video rounded-md bg-black'
                accentColor='#3a7bd5'
                playbackId={lessons[lessonIndex].muxData.muxPlaybackId}
              />
            </div>
          ) : (
            <Controller
              name={`sections.${sectionIndex}.lessons.${lessonIndex}.videoUrl`}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className='flex flex-row items-center justify-between'>
                    <FieldLabel htmlFor={field.name}>Video URL:</FieldLabel>
                  </div>

                  {field.value ? (
                    <Alert className='rounded-md border-l-6 border-green-600 bg-green-600/10 text-green-600 dark:border-green-400 dark:bg-green-400/10 dark:text-green-400'>
                      <Video />
                      <AlertTitle>Video Uploaded Successfully</AlertTitle>
                    </Alert>
                  ) : (
                    <UploadDropzone
                      endpoint={'videoUploader'}
                      className={cn(
                        'ut-button:bg-orange-500 ut-button:w-full ut-button:cursor-pointer ut-button:hover:bg-orange-600 ut-button:duration-300 ut-button:ut-uploading:bg-green-500 ut-button:ut-uploading:pointer-events-none ut-button:ut-uploading:opacity-60  bg-slate-800 border-0 cursor-pointer hover:bg-slate-900 duration-300 ut-label:text-white ut-allowed-content:text-white',
                        field.value && 'pointer-events-none opacity-50',
                      )}
                      onClientUploadComplete={(res) => {
                        toast.success('Video uploaded successfully!');
                        field.onChange(res[0].ufsUrl);
                        form.setValue(
                          `sections.${sectionIndex}.lessons.${lessonIndex}.uploadthingFileId`,
                          res[0].key,
                        );
                      }}
                      disabled={!!field.value}
                    />
                  )}
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}
        </FieldGroup>

        {pathname.includes('edit') && isUpdatingVideo === lessonIndex && (
          <div className='w-full  p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/5 transition-all duration-300'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full'>
                  <Video className='size-5 text-indigo-600 dark:text-indigo-400' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 dark:text-white'>
                    Upload Replacement Video
                  </h3>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    A new video will replace the current one for this lesson.
                  </p>
                </div>
              </div>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => setIsUpdatingVideo(null)}
                className='text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer'
              >
                Cancel
              </Button>
            </div>

            <UploadDropzone
              endpoint={'videoUploader'}
              className={cn(
                'ut-button:bg-gradient-to-r ut-button:from-indigo-500 ut-button:to-blue-500 ut-button:w-full ut-button:cursor-pointer ut-button:hover:opacity-90 ut-button:duration-300 ut-button:ut-uploading:bg-green-500 ut-button:ut-uploading:pointer-events-none ut-button:ut-uploading:opacity-60',
                'bg-indigo-50/50 dark:bg-gray-800/50 border-2 border-dashed border-indigo-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-indigo-400 dark:hover:border-gray-600 duration-300',
                'ut-label:text-indigo-600 dark:ut-label:text-indigo-400 ut-label:font-semibold',
                'ut-allowed-content:text-gray-500 dark:ut-allowed-content:text-gray-400',
              )}
              onClientUploadComplete={(res) => {
                toast.success('Video uploaded successfully!');
                form.setValue(
                  `sections.${sectionIndex}.lessons.${lessonIndex}.videoUrl`,
                  res[0].ufsUrl,
                );
                form.setValue(
                  `sections.${sectionIndex}.lessons.${lessonIndex}.uploadthingFileId`,
                  res[0].key,
                );
                setIsUpdatingVideo(null);
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LessonCard;
