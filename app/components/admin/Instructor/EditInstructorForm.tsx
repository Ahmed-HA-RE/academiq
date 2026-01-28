'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Instructor, InstructorFormData } from '@/types';
import { instructorUpdateSchema } from '@/schema';
import { toast } from 'sonner';
import { Card, CardContent } from '../../ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '../../ui/field';
import { Input } from '../../ui/input';
import { PhoneInput } from '../../ui/phone-input';
import { Textarea } from '../../ui/textarea';
import MultipleSelector from '../../ui/multi-select';
import { TEACHING_CATEGORIESMULTISELECT } from '@/lib/constants';
import {
  updateInstructorAccount,
  updateInstructorAsAdmin,
} from '@/lib/actions/instructor/updateInstructor';
import { useRouter } from 'next/navigation';
import ScreenSpinner from '../../ScreenSpinner';
import { Button } from '../../ui/button';
import AvatarUpload from '../../AvatarUpload';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const EditInstructorForm = ({
  instructor,
  type,
  providerId,
}: {
  instructor: Instructor;
  type: 'admin' | 'instructor';
  providerId: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<InstructorFormData>({
    resolver: zodResolver(instructorUpdateSchema),
    defaultValues: {
      bio: instructor.bio,
      socialLinks: {
        whatsapp:
          instructor.socialLinks.whatsapp &&
          '+' + instructor.socialLinks.whatsapp.split('/').at(-1),
        instagram: instructor.socialLinks.instagram,
        linkedin: instructor.socialLinks.linkedin,
      },
      expertise: instructor.expertise,
      email: instructor.user.email,
      name: instructor.user.name,
      phone: instructor.phone,
      // image: instructor.user.image,
    },
  });

  const onSuccess = async (data: InstructorFormData) => {
    let res;

    if (type === 'admin') {
      res = await updateInstructorAsAdmin({ data, id: instructor.id });
    } else {
      res = await updateInstructorAccount({ data });
    }
    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    setTimeout(
      () =>
        router.push(
          `/${type}-dashboard/${type === 'admin' ? 'instructors' : '/'}`,
        ),
      500,
    );
  };

  return (
    <>
      {form.formState.isSubmitting && (
        <ScreenSpinner mutate={true} text='Updating...' />
      )}
      <Card
        className={cn(
          pathname === '/instructor-dashboard/settings'
            ? 'shadow-none border-none col-span-4'
            : '',
        )}
      >
        <CardContent>
          <form onSubmit={form.handleSubmit(onSuccess)}>
            <FieldGroup
              className={cn(
                pathname === '/instructor-dashboard/settings' &&
                  'grid grid-cols-1 md:grid-cols-2 gap-6',
              )}
            >
              {/* Name */}
              <Controller
                name='name'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className='leading-5' htmlFor={field.name}>
                      Instructor Name
                    </FieldLabel>
                    <Input
                      type='text'
                      id={field.name}
                      placeholder='Instructor name'
                      aria-invalid={fieldState.invalid}
                      className='input'
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Email */}
              <Controller
                name='email'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className='leading-5' htmlFor={field.name}>
                      Instructor Email
                    </FieldLabel>
                    <Input
                      type='email'
                      id={field.name}
                      placeholder='Instructor email'
                      aria-invalid={fieldState.invalid}
                      className='input'
                      disabled={providerId !== 'credentials'}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Phone Number  */}
              <Controller
                name='phone'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Instructor Phone
                    </FieldLabel>
                    <PhoneInput
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      defaultCountry='AE'
                      international
                      countryCallingCodeEditable={false}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Expertise */}
              <Controller
                name='expertise'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Expertise</FieldLabel>
                    <MultipleSelector
                      commandProps={{
                        label: 'Select categories',
                      }}
                      value={TEACHING_CATEGORIESMULTISELECT.filter((option) =>
                        field.value.includes(option.value),
                      )}
                      onChange={(options) =>
                        field.onChange(options.map((opt) => opt.value))
                      }
                      defaultOptions={TEACHING_CATEGORIESMULTISELECT}
                      placeholder='Select categories'
                      emptyIndicator={
                        <p className='text-center text-sm'>No results found</p>
                      }
                      className='w-full'
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* WhatsApp Number  */}
              <Controller
                name='socialLinks.whatsapp'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className='flex flex-row justify-between items-center'>
                      <FieldLabel htmlFor={field.name}>WhatsApp</FieldLabel>
                      <span className='text-muted-foreground text-xs'>
                        Optional field
                      </span>
                    </div>
                    <PhoneInput
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder='Enter your WhatsApp 
                    number'
                      defaultCountry='AE'
                      international
                      countryCallingCodeEditable={false}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Instagram */}
              <Controller
                name='socialLinks.instagram'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className='flex flex-row justify-between items-center'>
                      <FieldLabel htmlFor={field.name}>Instagram</FieldLabel>
                      <span className='text-muted-foreground text-xs'>
                        Optional field
                      </span>
                    </div>
                    <Input
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder='Enter your Instagram Username'
                      className='input'
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* LinkedIn */}
              <Controller
                name='socialLinks.linkedin'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    className={cn(
                      pathname === '/instructor-dashboard/settings' &&
                        'md:col-span-2',
                    )}
                    data-invalid={fieldState.invalid}
                  >
                    <div className='flex flex-row justify-between items-center'>
                      <FieldLabel htmlFor={field.name}>LinkedIn</FieldLabel>
                      <span className='text-muted-foreground text-xs'>
                        Optional field
                      </span>
                    </div>
                    <Input
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder='Enter your LinkedIn Username'
                      className='input'
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Bio */}
              <Controller
                name='bio'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    className='md:col-span-2'
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel className='leading-5' htmlFor={field.name}>
                      Instructor Bio
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      className='min-h-40 resize-none input'
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Avatar */}
              <Controller
                name='image'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Avatar</FieldLabel>
                    <div className='flex flex-row items-center gap-4'>
                      <AvatarUpload
                        userImage={instructor.user.image}
                        onChange={field.onChange}
                      />
                      <span className='text-sm text-muted-foreground'>
                        Recommended size: 64x64px.{' '}
                        <span className='block mt-2'>Max size: 5MB.</span>
                      </span>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <Button className='w-full cursor-pointer mt-6' type='submit'>
              {pathname === '/instructor-dashboard/settings'
                ? 'Update Settings'
                : 'Update Instructor'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default EditInstructorForm;
