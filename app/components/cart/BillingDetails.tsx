'use client';

import { Controller, UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { PhoneInput } from '../ui/phone-input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { LIST_COUNTRIES } from '@/lib/utils';
import { BillingInfo } from '@/types';
import { FormEvent } from 'react';
import { Button } from '../ui/button';
import { ArrowDownIcon } from 'lucide-react';

const BillingDetails = ({
  form,
  onSubmit,
}: {
  form: UseFormReturn<BillingInfo>;
  onSubmit: (e: FormEvent) => void;
}) => {
  return (
    <form onSubmit={onSubmit}>
      <Card className='shadow-none border-0 py-0 pt-4'>
        <CardContent className='px-0'>
          <FieldGroup className='gap-6'>
            {/* Full Name */}
            <Controller
              name='name'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                  <Input
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className='input'
                    placeholder='Enter your full name'
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Email Address */}
            <Controller
              name='email'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                  <Input
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className='input'
                    placeholder='Enter your email address'
                    {...field}
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
            {/* Country */}
            <Controller
              name='country'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Country</FieldLabel>
                  <Select
                    aria-invalid={fieldState.invalid}
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <SelectTrigger
                      id={field.name}
                      className='w-full cursor-pointer input'
                    >
                      <SelectValue placeholder='Select a country' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {LIST_COUNTRIES.map((country) => (
                          <SelectItem
                            key={country}
                            value={country}
                            className='cursor-pointer'
                          >
                            {country}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter className='px-0'>
          <Button className='cursor-pointer group'>
            Next Step
            <ArrowDownIcon
              className='-ms-1 group-hover:translate-y-0.5 opacity-70 transition-transform'
              size={16}
            />
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default BillingDetails;
