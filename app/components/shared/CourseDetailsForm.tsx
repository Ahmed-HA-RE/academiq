'use client';

import { Grid2x2Icon } from 'lucide-react';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'react-hot-toast';
import { Textarea } from '../ui/textarea';
import Tiptap from '../RichTextEditor';
import Image from 'next/image';
import { UploadDropzone } from '@/lib/uploadthing';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { DIFFICULTY_LEVELS } from '@/lib/utils';
import { COURSE_LANGUAGES, TEACHING_CATEGORIES } from '@/lib/constants';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { CreateCourse } from '@/types';

type CourseDetailsFormProps = {
  form: UseFormReturn<CreateCourse>;
};

const CourseDetailsForm = ({ form }: CourseDetailsFormProps) => {
  const pathname = usePathname();
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);

  return (
    <div className='space-y-6'>
      <div className='flex flex-row items-center gap-4'>
        <div className='bg-blue-500/10 p-3 rounded-xl'>
          <Grid2x2Icon className='size-6 text-blue-600 dark:text-blue-400' />
        </div>
        <div>
          <h4 className='font-semibold text-2xl'>Course Details</h4>
          <p className='text-sm text-muted-foreground mt-0.5'>
            Provide the basic information about your course
          </p>
        </div>
      </div>
      <FieldGroup className='px-2'>
        {/* Name */}
        <Controller
          name='title'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Course Title</FieldLabel>
              <Input
                id={field.name}
                placeholder='Course Title'
                {...field}
                aria-invalid={fieldState.invalid}
                className='input'
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Short Description */}
        <Controller
          name='shortDesc'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Course Short Description
              </FieldLabel>
              <div className='*:not-first:mt-2'>
                <Textarea
                  id={field.name}
                  placeholder='Leave a comment'
                  aria-invalid={fieldState.invalid}
                  className='input min-h-[70px] resize-none'
                  {...field}
                />
                {!fieldState.error && (
                  <p
                    aria-live='polite'
                    className='mt-2 text-muted-foreground text-xs'
                    role='region'
                  >
                    Please provide a short description summarizing the key
                    aspects of your course.
                  </p>
                )}
              </div>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Description */}
        <Controller
          name='description'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Course Description</FieldLabel>
              <Tiptap value={field.value} onChange={field.onChange} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Image */}
        <Controller
          name='image'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className='flex flex-row justify-between items-center'>
                <FieldLabel htmlFor={field.name}>Course Image</FieldLabel>
                {/* Add toggle update image only for edit page */}
                {pathname.includes('edit') && (
                  <Button
                    onClick={() => setIsUpdatingImage(!isUpdatingImage)}
                    type='button'
                    className='cursor-pointer'
                    variant={'link'}
                  >
                    {isUpdatingImage ? 'Cancel' : 'Change Image'}
                  </Button>
                )}
              </div>
              {field.value && !isUpdatingImage ? (
                <Image
                  src={field.value}
                  alt='Course Image'
                  width={0}
                  height={0}
                  sizes='100vw'
                  className='w-full max-w-lg mx-auto h-auto rounded-md mt-4'
                />
              ) : (
                <UploadDropzone
                  className='ut-button:bg-blue-500 ut-button:w-full cursor-pointer border-solid ut-label:text-black ut-allowed-content:text-black ut-label:dark:text-white ut-allowed-content:dark:text-white '
                  endpoint={'imageUploader'}
                  onClientUploadComplete={(res) => {
                    toast.success('Image uploaded successfully!');
                    field.onChange(res[0].ufsUrl);
                    form.setValue('imageKey', res[0].key);
                    setIsUpdatingImage(false);
                  }}
                />
              )}
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Prerequisites */}
        <Controller
          name='prequisites'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Course Prerequisites</FieldLabel>
              <Tiptap value={field.value} onChange={field.onChange} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Difficulty */}
          <Controller
            name='difficulty'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Course Difficulty</FieldLabel>

                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id={field.name}
                    className='w-full cursor-pointer input'
                  >
                    <SelectValue placeholder='Select difficulty' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Course Difficulty</SelectLabel>
                      {DIFFICULTY_LEVELS.map((level) => (
                        <SelectItem
                          key={level.value}
                          value={level.value}
                          className='cursor-pointer'
                        >
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {/* Category */}
          <Controller
            name='category'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Course Category</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id={field.name}
                    className='w-full cursor-pointer input'
                  >
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Course Category</SelectLabel>
                      {TEACHING_CATEGORIES.map((cat) => (
                        <SelectItem
                          key={cat}
                          value={cat}
                          className='cursor-pointer'
                        >
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Languages */}
          <Controller
            name='language'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Course Language</FieldLabel>

                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id={field.name}
                    className='w-full cursor-pointer input'
                  >
                    <SelectValue placeholder='Select language' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Course Language</SelectLabel>
                      {COURSE_LANGUAGES.map((lang) => (
                        <SelectItem
                          key={lang}
                          value={lang}
                          className='cursor-pointer'
                        >
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {/* Price */}
          <Controller
            name='price'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className='flex flex-row items-center justify-between'>
                  <FieldLabel htmlFor={field.name}>Course Price</FieldLabel>
                  <span className='text-sm text-muted-foreground'>
                    Prices are in (AED)
                  </span>
                </div>
                <Input
                  id={field.name}
                  type='number'
                  min={0}
                  step={0.01}
                  placeholder='Course Price'
                  {...field}
                  aria-invalid={fieldState.invalid}
                  className='input'
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
      </FieldGroup>
    </div>
  );
};

export default CourseDetailsForm;
