'use client';
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form';
import { Button } from '../ui/button';
import { CreateCourse } from '@/types';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Alert, AlertTitle } from '../ui/alert';
import { CircleX, Video } from 'lucide-react';
import { UploadDropzone } from '@/lib/uploadthing';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Spinner } from '../ui/spinner';

const AddLesson = ({
  form,
  sectionIndex,
}: {
  form: UseFormReturn<CreateCourse>;
  sectionIndex: number;
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `section.${sectionIndex}.lessons`,
  });

  return (
    <div className='space-y-6'>
      {fields.map((lesson, lessonIndex) => (
        <FieldGroup className='gap-5' key={lesson.id}>
          <Controller
            name={`section.${sectionIndex}.lessons.${lessonIndex}.title`}
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
                    onClick={() => remove(lessonIndex)}
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
            name={`section.${sectionIndex}.lessons.${lessonIndex}.duration`}
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
                  step={0.1}
                  placeholder='Duration in minutes'
                  className='input border-black dark:border-white/50 placeholder:text-black dark:placeholder:text-white/50 text-sm'
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name={`section.${sectionIndex}.lessons.${lessonIndex}.videoUrl`}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Video URL:</FieldLabel>
                {field.value ? (
                  <Alert className='rounded-md border-l-6 border-green-600 bg-green-600/10 text-green-600 dark:border-green-400 dark:bg-green-400/10 dark:text-green-400'>
                    <Video />
                    <AlertTitle>Video Uploaded Successfully</AlertTitle>
                  </Alert>
                ) : (
                  <UploadDropzone
                    endpoint={'videoUploader'}
                    className={cn(
                      'ut-button:bg-orange-500 ut-button:w-full ut-button:cursor-pointer ut-button:hover:bg-orange-600 ut-button:duration-300 ut-button:ut-uploading:bg-green-500 ut-button:ut-uploading:pointer-events-none ut-button:ut-uploading:opacity-60  bg-slate-800 border-0 cursor-pointer hover:bg-slate-800/90 duration-300 ut-label:text-white ut-allowed-content:text-white ut-upload-icon:text-white',
                      field.value && 'pointer-events-none opacity-50'
                    )}
                    onClientUploadComplete={(res) => {
                      toast.success('Video uploaded successfully!');
                      field.onChange(res[0].ufsUrl);
                    }}
                    disabled={!!field.value}
                    content={{
                      button: ({ ready, isUploading }) => {
                        if (isUploading) {
                          return <Spinner className='size-6' />;
                        }

                        return ready ? 'Upload Video' : 'Preparing...';
                      },
                      allowedContent: ({ isUploading, ready }) => {
                        if (isUploading) {
                          return 'Uploading...';
                        }
                        if (ready) {
                          return 'MP4, MOV up to (1GB)';
                        }
                        return 'Preparing...';
                      },
                      label: ({ ready, isUploading }) => {
                        if (isUploading) {
                          return 'Uploading video, please wait...';
                        }
                        if (ready) {
                          return 'Click to upload or drag and drop';
                        }
                        return 'Preparing...';
                      },
                    }}
                    onUploadError={(error: Error) => {
                      if (error.message.includes('FileSizeMismatch')) {
                        toast.error('File exceeds the maximum size of 1GB');
                      }
                    }}
                  />
                )}
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      ))}
      <div className='flex items-end justify-end'>
        <Button
          onClick={() =>
            append({
              duration: 0,
              title: '',
              videoUrl: '',
            })
          }
          className='cursor-pointer w-auto'
          type='button'
          variant={'outline'}
        >
          Add Lesson +{' '}
        </Button>
      </div>
    </div>
  );
};

export default AddLesson;
