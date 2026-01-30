'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { createCourseSchema } from '@/schema';
import {
  Course,
  CreateCourse,
  Instructor,
  Section,
  User,
} from '../../../../types';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { FieldLegend, FieldSet } from '../../ui/field';
import { Button } from '../../ui/button';
import AddCourseSection from '../../shared/AddCourseSection';
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/motion-tabs';
import { createCourse } from '@/lib/actions/course/createCourse';
import {
  updateCourse,
  updateCourseAsAdmin,
} from '@/lib/actions/course/updateCourse';
import { useRouter } from 'next/navigation';
import ScreenSpinner from '../../ScreenSpinner';
import CourseDetailsForm from '../../shared/CourseDetailsForm';

import { TriangleAlertIcon } from 'lucide-react';

const CreateCourseForm = ({
  course,
  type,
  instructor,
  user,
}: {
  course?: Course & { sections: Section[] };
  type: 'create' | 'edit';
  instructor?: Instructor;
  user?: User;
}) => {
  const router = useRouter();

  const form = useForm<CreateCourse>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: course
      ? course
      : {
          title: '',
          shortDesc: '',
          description: '',
          price: '',
          image: '',
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
    if (type === 'edit' && !user) {
      const res = await updateCourse(course ? course.id : '', data);
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      router.push('/instructor-dashboard/courses');
    } else if (type === 'edit' && user && user.role === 'admin') {
      const res = await updateCourseAsAdmin(course ? course.id : '', data);
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      router.push('/admin-dashboard/courses');
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

  return (
    <>
      {form.formState.isSubmitting && (
        <ScreenSpinner
          mutate={true}
          text={type === 'create' ? 'Creating...' : 'Updating...'}
        />
      )}
      {!isPublished && (
        <div className='bg-amber-200 dark:bg-amber-300 px-4 py-3 text-black mb-4 text-center flex flex-row items-center justify-center gap-2'>
          <TriangleAlertIcon aria-hidden='true' size={16} />
          <p className='text-sm'>
            This course is unpublished. It will not be visible to students.
          </p>
        </div>
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
            variant={'outline'}
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
              <CourseDetailsForm form={form} />
            </TabsContent>
            <TabsContent value='course-sections'>
              <AddCourseSection form={form} sections={course?.sections} />
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
