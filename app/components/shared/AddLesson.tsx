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
import LessonCard from './LessonCard';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';

const AddLesson = ({
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
    <Collapsible className='flex flex-col justify-between gap-2'>
      <div className='flex flex-row items-center justify-between'>
        <div className='text-base font-semibold'>Lessons</div>
        <CollapsibleTrigger asChild className='group cursor-pointer hover:bg-0'>
          <Button variant='ghost' size='icon-sm'>
            <ChevronDownIcon className='text-muted-foreground transition-transform group-data-[state=open]:rotate-180' />
            <span className='sr-only'>Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        {isLessonsNotAvailable && (
          <Alert className='border-destructive bg-destructive/10 text-destructive rounded-none border-0 border-l-6'>
            <X />
            <AlertTitle>
              No lessons added yet. Please add at least one lesson.
            </AlertTitle>
          </Alert>
        )}
        <div className='space-y-6'>
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

          <div className='mt-8 flex flex-col items-center gap-6'>
            <Button
              onClick={() =>
                append({
                  duration: 0,
                  title: '',
                  position:
                    form.getValues(`sections.${sectionIndex}.lessons`).length +
                    1,
                })
              }
              className='cursor-pointer w-auto btn-hover-affect !from-[#00d2ff] !via-[#3a7bd5] !to-[#00d2ff] text-base text-white'
              type='button'
              size={'lg'}
            >
              Add Lesson
              <Plus className='ml-2 size-5' />
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AddLesson;
