'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { createCourseSchema } from '@/schema';
import { Course, CreateCourse, Instructor } from '../../../../types';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '../../ui/input';
import Image from 'next/image';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '../../ui/field';
import { Grid2x2Icon } from 'lucide-react';
import Tiptap from '../../RichTextEditor';
import { Button } from '../../ui/button';
import slugify from 'slugify';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { DIFFICULTY_LEVELS } from '@/lib/utils';
import { COURSE_LANGUAGES, TEACHING_CATEGORIES } from '@/lib/constants';
import CourseSections from '../../shared/CourseSections';
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/motion-tabs';
import { createCourse, updateCourse } from '@/lib/actions/course';
import { usePathname, useRouter } from 'next/navigation';
import ScreenSpinner from '../../ScreenSpinner';
import { UploadDropzone } from '@/lib/uploadthing';
import { useState } from 'react';

const CreateCourseForm = ({
  course,
  type,
  instructor,
}: {
  course?: Course;
  type: 'create' | 'edit';
  instructor?: Instructor;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);

  const form = useForm<CreateCourse>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: course
      ? course
      : {
          title: '',
          description: '',
          price: '',
          image: '',
          slug: '',
          language: '',
          difficulty: '',
          prequisites: '',
          instructorId: instructor?.id,
          category: '',
          published: false,
          sections: [],
        },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: CreateCourse) => {
    if (type === 'edit') {
      const res = await updateCourse(course ? course.id : '', data);
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      router.push('/instructor-dashboard/courses');
    } else {
      const res = await createCourse(data);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      router.push('/instructor-dashboard/courses');
    }
  };

  // ignore eslint-disable-next-line react-hooks/rules-of-hooks
  const isPublished = form.watch('published');

  const isSlugged = form.watch('slug');

  return (
    <>
      {form.formState.isSubmitting && (
        <ScreenSpinner
          mutate={true}
          text={type === 'create' ? 'Creating...' : 'Updating...'}
        />
      )}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-2'>
          <FieldSet>
            <FieldLegend className='!text-3xl font-bold pt-4'>
              {type === 'create' ? 'Create New Course' : 'Edit Course'}
            </FieldLegend>
          </FieldSet>
          <Button
            type='button'
            className='cursor-pointer'
            onClick={() => {
              form.setValue('published', !form.getValues('published'));
            }}
          >
            {isPublished ? 'Unpublish Course' : 'Publish Course'}
          </Button>
        </div>

        <Tabs defaultValue='course-details' className='gap-4'>
          <TabsList className='mx-auto mb-4'>
            <TabsTrigger value='course-details'>Course Details</TabsTrigger>
            <TabsTrigger value='course-sections'>Course Sections</TabsTrigger>
          </TabsList>

          <TabsContents>
            <TabsContent value='course-details'>
              {/* Left Side */}
              <div className='space-y-6'>
                <div className='flex flex-row items-center gap-3'>
                  <span className='bg-blue-300/20 p-2.5 rounded-full'>
                    <Grid2x2Icon className='size-6 text-blue-400' />
                  </span>
                  <h4 className='font-medium text-2xl'>
                    Customize your course
                  </h4>
                </div>
                <FieldGroup className='px-2'>
                  {/* Name */}
                  <Controller
                    name='title'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Course Title
                        </FieldLabel>
                        <Input
                          id={field.name}
                          placeholder='Course Title'
                          {...field}
                          aria-invalid={fieldState.invalid}
                          className='input'
                        />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {/* Slug */}
                  <Controller
                    name='slug'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!isSlugged && fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Course Slug
                        </FieldLabel>
                        <div className='flex rounded-md shadow-xs'>
                          <Input
                            id={field.name}
                            type='text'
                            placeholder='Course Slug'
                            disabled
                            className='-me-px rounded-r-none shadow-none focus-visible:z-1 input'
                            aria-invalid={!isSlugged && fieldState.invalid}
                            value={field.value}
                          />
                          <Button
                            type='button'
                            className='rounded-l-none cursor-pointer'
                            onClick={() => {
                              const title = form.getValues('title');
                              const slug = slugify(title, {
                                lower: true,
                                strict: true,
                              });
                              form.setValue('slug', slug);
                              if (title) {
                                toast.success('Slug generated successfully');
                              }
                            }}
                          >
                            Generate
                          </Button>
                        </div>
                        {!isSlugged && fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  {/* Description */}
                  <Controller
                    name='description'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Course Description
                        </FieldLabel>
                        <Tiptap value={field.value} onChange={field.onChange} />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
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
                          <FieldLabel htmlFor={field.name}>
                            Course Image
                          </FieldLabel>
                          {/* Add toggle update image only for edit page */}
                          {pathname.includes('edit') && (
                            <Button
                              onClick={() =>
                                setIsUpdatingImage(!isUpdatingImage)
                              }
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
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {/* Prerequisites */}
                  <Controller
                    name='prequisites'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Course Prerequisites
                        </FieldLabel>
                        <Tiptap value={field.value} onChange={field.onChange} />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
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
                          <FieldLabel htmlFor={field.name}>
                            Course Difficulty
                          </FieldLabel>

                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
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
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    {/* Category */}
                    <Controller
                      name='category'
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>
                            Course Category
                          </FieldLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
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
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
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
                          <FieldLabel htmlFor={field.name}>
                            Course Language
                          </FieldLabel>

                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
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
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
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
                            <FieldLabel htmlFor={field.name}>
                              Course Price
                            </FieldLabel>
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
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                </FieldGroup>
              </div>
            </TabsContent>
            <TabsContent value='course-sections'>
              <CourseSections form={form} sections={course?.sections} />
              <Button
                size={'lg'}
                type='submit'
                className='mt-10 w-auto cursor-pointer text-base'
                disabled={form.formState.isSubmitting}
              >
                {type === 'create' ? 'Create Course' : 'Update Course'}
              </Button>
            </TabsContent>
          </TabsContents>
        </Tabs>
      </form>
    </>
  );
};

export default CreateCourseForm;
