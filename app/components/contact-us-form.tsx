'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { FieldLabel, FieldGroup, Field, FieldError } from './ui/field';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { contactUsSchema } from '@/schema';
import { User, ContactFormData } from '@/types';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { contactUs } from '@/lib/actions/contact/contact-us';
import { toast } from 'react-hot-toast';
import { Spinner } from './ui/spinner';

const ContactUsForm = ({ user }: { user: User | undefined }) => {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactUsSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      title: '',
      message: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: ContactFormData) => {
    const res = await contactUs(data);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message);
    form.reset();
  };

  return (
    <Card className='w-full rounded-3xl shadow-none py-10'>
      <CardHeader className='md:px-10'>
        <CardTitle className='text-2xl sm:text-4xl font-medium leading-tight'>
          Please enter your information
        </CardTitle>
      </CardHeader>
      <CardContent className='md:px-10'>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-6 w-full'
        >
          <FieldGroup>
            {/* Name */}
            <Controller
              name='name'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className='leading-5' htmlFor={field.name}>
                    Full Name
                  </FieldLabel>
                  <Input
                    type='text'
                    id={field.name}
                    placeholder='Enter your full name'
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
                    Email address
                  </FieldLabel>
                  <Input
                    type='email'
                    id={field.name}
                    placeholder='Enter your email address'
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
            {/* Title */}
            <Controller
              name='title'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className='leading-5' htmlFor={field.name}>
                    Title
                  </FieldLabel>
                  <Input
                    type='text'
                    id={field.name}
                    placeholder='Enter the title'
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
            {/* Bio */}
            <Controller
              name='message'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className='leading-5' htmlFor={field.name}>
                    Message
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    placeholder='Enter your message'
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
            <Button
              className='bg-primary hover:bg-primary-hover text-white rounded-full text-lg cursor-pointer h-12'
              size={'lg'}
              type='submit'
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  {' '}
                  <Spinner className='size-5' /> Submitting...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactUsForm;
