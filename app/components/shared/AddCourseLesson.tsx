'use client';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { Button } from '../ui/button';
import { Lesson, CreateCourse } from '@/types';
import { Alert, AlertTitle } from '../ui/alert';
import { ChevronDownIcon, Plus, X } from 'lucide-react';

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import LessonCard from './AddCourseLessonCard';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';

const AddCourseLesson = ({
  form,
  sectionIndex,
  lessons,
}: {
  form: UseFormReturn<CreateCourse>;
  sectionIndex: number;
  lessons?: Lesson[];
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `sections.${sectionIndex}.lessons`,
  });

  const isLessonsNotAvailable =
    form.watch(`sections.${sectionIndex}.lessons`)?.length === 0;

  const handleOnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active.id && over?.id) return;

    const oldIndex = fields.findIndex((lesson) => lesson.id === active.id);
    const newIndex = fields.findIndex((lesson) => lesson.id === over?.id);

    const movePositions = arrayMove(
      form.getValues(`sections.${sectionIndex}.lessons`),
      oldIndex,
      newIndex,
    );

    const updatedPositions = movePositions.map((lesson, index) => ({
      ...lesson,
      position: index + 1,
    }));

    form.setValue(`sections.${sectionIndex}.lessons`, updatedPositions);
  };

  return (
    <Collapsible className='flex flex-col justify-between gap-4 mt-6'>
      <div className='flex flex-row items-center justify-between'>
        <div className='text-base font-semibold text-foreground'>Lessons</div>
        <CollapsibleTrigger asChild className='group cursor-pointer'>
          <Button
            variant='ghost'
            size='icon-sm'
            className='hover:bg-muted rounded-lg'
          >
            <ChevronDownIcon className='text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180' />
            <span className='sr-only'>Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        {isLessonsNotAvailable && (
          <Alert className='border-l-4 border-destructive bg-destructive/5 text-destructive rounded-lg mb-4'>
            <X className='size-5' />
            <AlertTitle className='font-medium'>
              No lessons added yet. Please add at least one lesson.
            </AlertTitle>
          </Alert>
        )}
        <div className='grid grid-cols-1 gap-6'>
          <DndContext
            onDragEnd={handleOnDragEnd}
            collisionDetection={closestCenter}
          >
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((lesson, lessonIndex) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  lessons={lessons}
                  sectionIndex={sectionIndex}
                  lessonIndex={lessonIndex}
                  form={form}
                  remove={remove}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <Button
          onClick={() =>
            append({
              duration: 0,
              title: '',
              position:
                form.getValues(`sections.${sectionIndex}.lessons`).length + 1,
            })
          }
          className='cursor-pointer w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors mt-6'
          type='button'
          size={'lg'}
        >
          <Plus className='size-5' />
          Add Lesson
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AddCourseLesson;
