'use client ';

import { CircleX, ListChecks, Plus, TvMinimalPlay } from 'lucide-react';
import { Button } from '../ui/button';
import { Alert, AlertTitle } from '../ui/alert';
import { Card, CardContent } from '../ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form';
import { Input } from '../ui/input';

import { CreateCourse, Section } from '@/types';
import AddLesson from './AddLesson';
import { deleteCourseSections } from '@/lib/actions/course/courseDeletion';

type CourseSectionsProps = {
  form: UseFormReturn<CreateCourse>;
  sections?: Section;
};

const CourseSections = ({ form, sections }: CourseSectionsProps) => {
  const { fields, append, remove } = useFieldArray({
    name: 'sections',
    control: form.control,
  });

  return (
    <div className='space-y-6'>
      <div className='flex flex-row justify-between'>
        <div className='flex flex-row items-center gap-3'>
          <span className='bg-blue-300/20 p-2.5 rounded-full'>
            <ListChecks className='size-6 text-blue-400' />
          </span>
          <h4 className='font-medium text-2xl'>Course Sections</h4>
        </div>
        <Button
          type='button'
          variant={'outline'}
          size={'icon'}
          className='cursor-pointer'
          onClick={() =>
            append({
              title: '',
              lessons: [
                {
                  title: '',
                  duration: 0,
                  position: fields.length + 1,
                },
              ],
            })
          }
        >
          <Plus />
        </Button>
      </div>

      {fields.length === 0 ? (
        <Alert className='border-destructive bg-destructive/10 text-destructive rounded-none border-0 border-l-6 mt-4'>
          <TvMinimalPlay />
          <AlertTitle>
            No sections added yet. Please add at least one section.
          </AlertTitle>
        </Alert>
      ) : (
        fields.map((section, sectionIndex) => (
          <Card
            className='bg-blue-100 dark:bg-muted border-0 shadow-none gap-5'
            key={section.id}
          >
            <CardContent>
              <FieldGroup className='gap-4'>
                <Controller
                  name={`sections.${sectionIndex}.title`}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className='flex flex-row items-center justify-between'>
                        <FieldLabel htmlFor={field.name}>
                          Section title
                        </FieldLabel>
                        <Button
                          type='button'
                          variant={'ghost'}
                          size={'icon-sm'}
                          className='cursor-pointer hover:bg-0 p-0'
                          onClick={async () => {
                            remove(sectionIndex);
                            if (sections?.[sectionIndex]?.id) {
                              await deleteCourseSections(
                                sections?.[sectionIndex]?.id,
                              );
                            }
                          }}
                        >
                          <CircleX className='size-5' />
                        </Button>
                      </div>
                      <Input
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder='e.g Introduction to course...'
                        className='input border-black dark:border-white/50 placeholder:text-black dark:placeholder:text-white/50 text-sm'
                        {...field}
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                {/* Lessons */}
                <AddLesson
                  form={form}
                  sectionIndex={sectionIndex}
                  lessons={sections?.[sectionIndex]?.lessons}
                />
              </FieldGroup>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default CourseSections;
