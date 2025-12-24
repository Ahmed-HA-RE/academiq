'use client';

import { createApplicationSchema } from '@/schema';
import { toast } from 'sonner';
import { Spinner } from '../ui/spinner';
import { PhoneInput } from '../ui/phone-input';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import {
  FieldGroup,
  Field,
  FieldError,
  FieldLabel,
  FieldSet,
  FieldLegend,
  FieldDescription,
} from '../ui/field';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Calendar } from '../ui/calendar';
import PDFFileUpload from '../PDFFileUpload';
import { Button } from '../ui/button';
import { TEACHING_CATEGORIES } from '@/lib/constants';
import MultipleSelector from '../ui/multi-select';
import { auth } from '@/lib/auth';
import { applyToTeach } from '@/lib/actions/instructor';

const ApplicationForm = ({
  user,
}: {
  user: typeof auth.$Infer.Session.user;
}) => {
  const form = useForm<z.infer<typeof createApplicationSchema>>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: {
      userId: user.id,
      bio: '',
      expertise: [],
      address: '',
      phone: '',
      socialLinks: {
        instagram: '',
        linkedin: '',
        whatsapp: '',
      },

      birthDate: new Date(),
    },
  });

  const onSubmit = async (data: z.infer<typeof createApplicationSchema>) => {
    const res = await applyToTeach(data);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message);
    setTimeout(() => window.location.reload(), 700);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldLegend className='!text-3xl font-bold ' variant='legend'>
          Become an Instructor
        </FieldLegend>
        <FieldDescription className='!text-base'>
          Fill out the form below to start your teaching journey
        </FieldDescription>
        <FieldGroup className='gap-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
                    value={TEACHING_CATEGORIES.filter((option) =>
                      field.value.includes(option.value)
                    )}
                    onChange={(options) =>
                      field.onChange(options.map((opt) => opt.value))
                    }
                    defaultOptions={TEACHING_CATEGORIES}
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
            {/* Phone Number */}
            <Controller
              name='phone'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                  <PhoneInput
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder='Enter your phone number'
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
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Bio */}
            <Controller
              name='bio'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                  <Textarea
                    id={field.name}
                    placeholder='Tell us about yourself'
                    className='field-sizing-content max-h-30 min-h-0 resize-none py-1.75 input'
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Address */}
            <Controller
              name='address'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                  <Input
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder='Enter your address'
                    className='input'
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          {/* Social Links */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
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
                <Field data-invalid={fieldState.invalid}>
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
          </div>
          <div className='flex flex-col md:flex-row gap-4'>
            {/* Birth Date */}
            <Controller
              name='birthDate'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className='md:flex-1/2 md:max-w-[350px]'
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor={field.name}>Birth Date</FieldLabel>
                  <Calendar
                    mode='single'
                    defaultMonth={new Date()}
                    numberOfMonths={1}
                    captionLayout='dropdown-years'
                    selected={field.value}
                    onSelect={field.onChange}
                    className='rounded-lg border'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* PDF File */}
            <Controller
              name='file'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className='w-full md:flex-1/2'
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel>Portfolio</FieldLabel>
                  <PDFFileUpload onChange={field.onChange} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <Button
            type='submit'
            className='cursor-pointer md:h-10 md:text-base mb-4'
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Spinner className='size-6' />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default ApplicationForm;
