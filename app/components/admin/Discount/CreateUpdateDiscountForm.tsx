'use client';
import { Controller, useForm } from 'react-hook-form';
import { CreateDiscount, Discount } from '@/types';
import { discountSchema } from '@/schema';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '../../ui/field';
import { Input } from '../../ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Button } from '../../ui/button';
import { DateTimePickerForm } from '../../DateTimePicker';
import { createDiscount } from '@/lib/actions/discount';
import { useRouter } from 'next/navigation';
import ScreenSpinner from '../../ScreenSpinner';

const CreateUpdateDiscountForm = ({
  type,
  discount,
}: {
  type: string;
  discount?: Discount;
}) => {
  const router = useRouter();

  const form = useForm<CreateDiscount>({
    resolver: zodResolver(discountSchema),
    defaultValues:
      type === 'edit' && discount
        ? {
            code: discount.code,
            type: discount.type,
            amount: discount.amount,
            validUntil: new Date(discount.validUntil),
          }
        : {
            code: '',
            type: 'percentage',
            amount: 0,
            validUntil: new Date(),
          },
    mode: 'onSubmit',
  });

  const onSuccess = async (data: CreateDiscount) => {
    const res = await createDiscount(data);
    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    router.push('/admin-dashboard/discounts');
  };

  return (
    <>
      {form.formState.isSubmitting && (
        <ScreenSpinner
          mutate={true}
          text={type === 'create' ? 'Creating...' : 'Updating...'}
        />
      )}
      <form onSubmit={form.handleSubmit(onSuccess)} className='col-span-4'>
        <FieldGroup className='gap-6'>
          <FieldSet>
            <FieldLegend className='text-center !text-2xl uppercase font-semibold'>
              {type === 'create'
                ? 'Create Discount Code'
                : 'Edit Discount Code'}
            </FieldLegend>
          </FieldSet>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Code Name */}
            <Controller
              name='code'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Code Name</FieldLabel>
                  <Input
                    id={field.name}
                    className='input'
                    placeholder='e.g, SALE_6'
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* type */}
            <Controller
              name='type'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                  <Select
                    aria-invalid={fieldState.invalid}
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <SelectTrigger
                      id={field.name}
                      className='w-full cursor-pointer input'
                    >
                      <SelectValue placeholder='Select a type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Discount Types</SelectLabel>
                        <SelectItem
                          value='percentage'
                          className='cursor-pointer'
                        >
                          Percentage (%)
                        </SelectItem>
                        <SelectItem value='fixed' className='cursor-pointer'>
                          Fixed Amount (AED)
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Amount */}
            <Controller
              name='amount'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Amount</FieldLabel>
                  <Input
                    id={field.name}
                    className='input'
                    placeholder='Enter amount'
                    min={0}
                    step={0.25}
                    type='number'
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Valid until */}
            <Controller
              name='validUntil'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} className='px-1'>
                    Valid Until
                  </FieldLabel>
                  <DateTimePickerForm
                    dateValue={field.value}
                    onValueChange={field.onChange}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <Button className='w-full cursor-pointer rounded-full text-base h-11 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'>
            {type === 'create' ? 'Create Discount' : 'Update Discount'}
          </Button>
        </FieldGroup>
      </form>
    </>
  );
};

export default CreateUpdateDiscountForm;
