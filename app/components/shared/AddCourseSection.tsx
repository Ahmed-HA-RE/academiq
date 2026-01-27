'use client ';

import { ListChecks, Plus, TvMinimalPlay } from 'lucide-react';
import { Button } from '../ui/button';
import { Alert, AlertTitle } from '../ui/alert';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { CreateCourse, Section } from '@/types';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import AddCourseSectionCard from './AddCourseSectionCard';

type AddCourseSectionProps = {
  form: UseFormReturn<CreateCourse>;
  sections?: Section[];
};

const AddCourseSection = ({ form, sections }: AddCourseSectionProps) => {
  const { fields, append, remove } = useFieldArray({
    name: 'sections',
    control: form.control,
  });

  const onEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active.id && !over?.id) return;

    const oldIndex = fields.findIndex((section) => section.id === active.id);
    const newIndex = fields.findIndex((section) => section.id === over?.id);

    const movePositions = arrayMove(
      form.getValues(`sections`),
      oldIndex,
      newIndex,
    );

    const updatedPositions = movePositions.map((section, index) => ({
      ...section,
      position: index + 1,
    }));

    form.setValue(`sections`, updatedPositions);
  };

  return (
    <div className='space-y-8'>
      <div className='flex flex-row justify-between items-center gap-4'>
        <div className='flex flex-row items-center gap-4'>
          <div className='bg-blue-500/10 p-3 rounded-xl'>
            <ListChecks className='size-6 text-blue-600 dark:text-blue-400' />
          </div>
          <div>
            <h4 className='font-semibold text-2xl'>Course Sections</h4>
            <p className='text-sm text-muted-foreground mt-0.5'>
              Organize your course content into sections
            </p>
          </div>
        </div>
        <Button
          type='button'
          variant={'outline'}
          size={'default'}
          className='cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 transition-all'
          onClick={() =>
            append({
              title: '',
              position: fields.length + 1,
              lessons: [
                {
                  title: '',
                  duration: 0,
                  position: 1,
                },
              ],
            })
          }
        >
          <Plus className='size-4' />
          Add Section
        </Button>
      </div>

      {fields.length === 0 ? (
        <Alert className='border-l-4 border-destructive bg-destructive/5 text-destructive rounded-lg'>
          <TvMinimalPlay className='size-5' />
          <AlertTitle className='font-medium'>
            No sections added yet. Please add at least one section.
          </AlertTitle>
        </Alert>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-2 items-start gap-4'>
          <DndContext onDragEnd={onEnd}>
            <SortableContext items={fields} strategy={rectSortingStrategy}>
              {fields.map((section, sectionIndex) => (
                <AddCourseSectionCard
                  key={section.id}
                  form={form}
                  sectionIndex={sectionIndex}
                  sectionId={section.id}
                  sections={sections}
                  remove={remove}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default AddCourseSection;
