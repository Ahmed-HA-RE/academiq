'use client';

import { Controller, UseFormReturn } from 'react-hook-form';
import { Card, CardContent } from '../ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { CircleX, GripVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import AddCourseLesson from './AddCourseLesson';
import { CreateCourse, Section } from '@/types';
import { deleteCourseSections } from '@/lib/actions/course/courseDeletion';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

type AddCourseSectionCardProps = {
  sectionId: string;
  sections: Section[] | undefined;
  sectionIndex: number;
  form: UseFormReturn<CreateCourse>;
  remove: (index: number) => void;
};

const AddCourseSectionCard = ({
  form,
  sectionIndex,
  sections,
  sectionId,
  remove,
}: AddCourseSectionCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: sectionId });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className='bg-white dark:bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow'
    >
      <CardContent>
        <FieldGroup className='gap-1'>
          <Controller
            name={`sections.${sectionIndex}.title`}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className='flex flex-row items-center justify-between mb-2'>
                  <div className='flex items-center gap-1'>
                    <div
                      {...attributes}
                      {...listeners}
                      className='p-1 hover:bg-muted/50 rounded-md transition-colors cursor-move'
                    >
                      <GripVertical className='size-5 text-muted-foreground' />
                    </div>
                    <FieldLabel
                      htmlFor={field.name}
                      className='text-base font-semibold'
                    >
                      Section Title
                    </FieldLabel>
                  </div>
                  <Button
                    type='button'
                    variant={'ghost'}
                    size={'icon-sm'}
                    className='cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors rounded-lg'
                    onClick={async () => {
                      remove(sectionIndex);
                      if (sections?.[sectionIndex]?.id) {
                        await deleteCourseSections(
                          sections?.[sectionIndex]?.id,
                        );
                      }
                    }}
                  >
                    <CircleX className='size-4' />
                  </Button>
                </div>
                <Input
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder='e.g., Introduction to Course'
                  className='input border-border focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all'
                  {...field}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {/* Lessons */}
          <AddCourseLesson
            form={form}
            sectionIndex={sectionIndex}
            lessons={sections?.[sectionIndex]?.lessons}
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
};

export default AddCourseSectionCard;
