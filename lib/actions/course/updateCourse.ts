'use server';

import { DEMO_COURSE_VIDEOS } from '@/lib/constants';
import mux from '@/lib/mux';
import { prisma } from '@/lib/prisma';
import { createCourseSchema } from '@/schema';
import { revalidatePath } from 'next/cache';
import { UTApi } from 'uploadthing/server';
import { getCurrentLoggedInInstructor } from '../instructor/getInstructor';
import { CreateCourse } from '@/types';
import { getCurrentLoggedUser } from '../getUser';

// Update course as instructor
export const updateCourse = async (courseId: string, data: CreateCourse) => {
  try {
    const instructor = await getCurrentLoggedInInstructor();

    if (instructor.id !== data.instructorId)
      throw new Error('You are not authorized to update this course');

    const course = await prisma.course.findUnique({
      where: { id: courseId, instructorId: instructor.id },
    });

    if (!course) throw new Error('Course not found');

    const isNewLessonsVideosUploaded = data.sections
      .map((section) => section.lessons)
      .flat()
      .filter((lesson) => !lesson.id) // only new lessons
      .every((lesson) => lesson.videoUrl && lesson.videoUrl.trim() !== '');

    if (!isNewLessonsVideosUploaded)
      throw new Error(
        'Please upload all new lesson videos before updating the course.',
      );

    const validatedData = createCourseSchema.safeParse(data);

    if (!validatedData.success) throw new Error('Invalid course data');

    // Delete existing course image from Uploadthing if imageKey has changed
    if (validatedData.data.imageKey !== course.imageKey) {
      const utapi = new UTApi();
      await utapi.deleteFiles([course.imageKey]);
    }
    // Update Course
    const updatedCourse = await prisma.course.update({
      where: { id: course.id, instructorId: course.instructorId },
      data: {
        title: validatedData.data.title,
        shortDesc: validatedData.data.shortDesc,
        description: validatedData.data.description,
        price: validatedData.data.price,
        difficulty: validatedData.data.difficulty,
        category: validatedData.data.category,
        image: validatedData.data.image,
        language: validatedData.data.language,
        prequisites: validatedData.data.prequisites,
        instructorId: validatedData.data.instructorId,
        slug: validatedData.data.slug,
        published: validatedData.data.published,
        imageKey: validatedData.data.imageKey,
      },
    });

    for (const section of validatedData.data.sections) {
      // Update Sections
      let sectionId;

      if (section.id) {
        sectionId = await prisma.section.update({
          where: {
            id: section.id,
          },
          data: {
            title: section.title,
          },
        });
      } else if (!section.id) {
        // Create new section
        sectionId = await prisma.section.create({
          data: {
            title: section.title,
            courseId: updatedCourse.id,
          },
        });
      }

      // Update Existing Lessons
      for (const lesson of section.lessons) {
        if (lesson.id) {
          await prisma.lesson.update({
            where: {
              id: lesson.id,
            },
            data: lesson,
          });

          // Replace mux video asset and uploadthingFileId if the new video is uploaded
          if (lesson.videoUrl && lesson.videoUrl.trim() !== '') {
            const existingMuxData = await prisma.muxData.findUnique({
              where: { lessonId: lesson.id },
            });
            if (!existingMuxData) continue;

            // Delete existing mux asset
            await mux.video.assets.delete(existingMuxData.muxAssetId);

            const utapi = new UTApi();
            await utapi.deleteFiles([existingMuxData.uploadthingFileId]);

            // Note: Using demo video ids for all lessons in the demo course

            // const updatedmuxData = await mux.video.assets.create({
            //   inputs: [{ url: lesson.videoUrl }],
            //   playback_policy: ['public'],
            // });

            await prisma.muxData.update({
              where: { id: existingMuxData.id },
              data: {
                muxAssetId: DEMO_COURSE_VIDEOS.muxAssetId,
                muxPlaybackId: DEMO_COURSE_VIDEOS.muxPlaybackId,
                uploadthingFileId: lesson.uploadthingFileId,
              },
            });
          }
        } else {
          // Create new lesson
          const newLesson = await prisma.lesson.create({
            data: {
              title: lesson.title,
              duration: lesson.duration,
              sectionId: sectionId?.id as string,
              position: lesson.position,
            },
          });

          // Create Mux Asset for the new lesson

          // Note: Using demo video ids for all lessons in the demo course

          // const muxData = await mux.video.assets.create({
          //   inputs: [{ url: lesson.videoUrl || '' }],
          //   playback_policy: ['public'],
          // });

          // if(!muxData) continue;

          await prisma.muxData.create({
            data: {
              lessonId: newLesson.id,
              muxAssetId: DEMO_COURSE_VIDEOS.muxAssetId,
              muxPlaybackId: DEMO_COURSE_VIDEOS.muxPlaybackId,
              uploadthingFileId: lesson.uploadthingFileId as string,
            },
          });

          const utapi = new UTApi();
          await utapi.deleteFiles([lesson.uploadthingFileId as string]);
        }
      }
    }

    revalidatePath('/instructor-dashboard/courses', 'page');

    return { success: true, message: 'Course updated successfully.' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

// Update course as admin
export const updateCourseAsAdmin = async (
  courseId: string,
  data: CreateCourse,
) => {
  try {
    const user = await getCurrentLoggedUser();

    if (!user || user.role !== 'admin')
      throw new Error('Only admins can update courses');

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) throw new Error('Course not found');

    const isNewLessonsVideosUploaded = data.sections
      .map((section) => section.lessons)
      .flat()
      .filter((lesson) => !lesson.id) // only new lessons
      .every((lesson) => lesson.videoUrl && lesson.videoUrl.trim() !== '');

    if (!isNewLessonsVideosUploaded)
      throw new Error(
        'Please upload all new lesson videos before updating the course.',
      );

    const validatedData = createCourseSchema.safeParse(data);

    if (!validatedData.success) throw new Error('Invalid course data');

    // Delete existing course image from Uploadthing if imageKey has changed
    if (validatedData.data.imageKey !== course.imageKey) {
      const utapi = new UTApi();
      await utapi.deleteFiles([course.imageKey]);
    }
    // Update Course
    const updatedCourse = await prisma.course.update({
      where: { id: course.id },
      data: {
        title: validatedData.data.title,
        description: validatedData.data.description,
        price: validatedData.data.price,
        difficulty: validatedData.data.difficulty,
        category: validatedData.data.category,
        image: validatedData.data.image,
        language: validatedData.data.language,
        prequisites: validatedData.data.prequisites,
        instructorId: validatedData.data.instructorId,
        slug: validatedData.data.slug,
        published: validatedData.data.published,
        imageKey: validatedData.data.imageKey,
      },
    });

    let newSectionId;

    // Update Sections and Lessons
    for (const section of validatedData.data.sections) {
      if (section.id) {
        await prisma.section.update({
          where: {
            id: section.id,
          },
          data: {
            title: section.title,
          },
        });
      } else {
        // Create new section
        newSectionId = await prisma.section.create({
          data: {
            title: section.title,
            courseId: updatedCourse.id,
          },
          select: { id: true },
        });
        newSectionId = newSectionId.id;
      }

      for (const lesson of section.lessons) {
        console.log(lesson.position);
        if (lesson.id) {
          // Update existing lesson
          const existingLesson = await prisma.lesson.update({
            where: {
              id: lesson.id,
            },
            data: {
              title: lesson.title,
              duration: lesson.duration,
            },
          });

          // fetch existing muxData
          const existingMuxData = await prisma.muxData.findFirst({
            where: { lessonId: existingLesson.id },
          });

          if (!existingMuxData) {
            throw new Error('Mux data for the lesson not found');
          }

          // If there's a new video URL for the existing lesson, update the existing Mux asset
          if (lesson.videoUrl && lesson.videoUrl.trim() !== '') {
            // Delete existing mux asset
            await mux.video.assets.delete(existingMuxData.muxAssetId);

            // Note: Using demo video ids for all lessons in the demo course

            // const updatedmuxData = await mux.video.assets.create({
            //   inputs: [{ url: lesson.videoUrl }],
            //   playback_policy: ['public'],
            // });

            // if (!updatedmuxData || !updatedmuxData.playback_ids) {
            //   throw new Error('Failed to update Mux asset');
            // }

            const muxData = await prisma.muxData.update({
              where: { id: existingMuxData.id },
              data: {
                uploadthingFileId: lesson.uploadthingFileId,
                muxPlaybackId: DEMO_COURSE_VIDEOS.muxPlaybackId,
                muxAssetId: DEMO_COURSE_VIDEOS.muxAssetId,
              },
            });

            // Delete uploadThing file key for Demo purpose only
            const utapi = new UTApi();
            await utapi.deleteFiles([muxData.uploadthingFileId]);
          }
        } else {
          // Create new lesson
          const newLesson = await prisma.lesson.create({
            data: {
              title: lesson.title,
              duration: lesson.duration,
              sectionId: newSectionId as string,
              position: lesson.position,
            },
          });

          // Create Mux Asset for the new lesson

          // Note: Using demo video ids for all lessons in the demo course

          // const muxData = await mux.video.assets.create({
          //   inputs: [{ url: lesson.videoUrl || '' }],
          //   playback_policy: ['public'],
          // });

          // if (!muxData || !muxData.playback_ids) {
          //   throw new Error('Failed to create Mux asset');
          // }

          // Store Mux Data in the database
          const muxData = await prisma.muxData.create({
            data: {
              lessonId: newLesson.id,
              muxAssetId: DEMO_COURSE_VIDEOS.muxAssetId,
              muxPlaybackId: DEMO_COURSE_VIDEOS.muxPlaybackId,
              uploadthingFileId: lesson.uploadthingFileId || '',
            },
          });
          // Delete uploadThing file key for Demo purpose only
          const utapi = new UTApi();
          await utapi.deleteFiles([muxData.uploadthingFileId]);
        }
      }
    }

    revalidatePath('/admin-dashboard/courses', 'page');
    return { success: true, message: 'Course updated successfully.' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
