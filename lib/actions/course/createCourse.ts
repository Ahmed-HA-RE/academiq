'use server';

import { CreateCourse } from '@/types';
import { getCurrentLoggedInInstructor } from '../instructor/getInstructor';
import { createCourseSchema } from '@/schema';
import { prisma } from '@/lib/prisma';
import { DEMO_COURSE_VIDEOS } from '@/lib/constants';
import { UTApi } from 'uploadthing/server';

// Create a new course
export const createCourse = async (data: CreateCourse) => {
  try {
    await getCurrentLoggedInInstructor();

    const isVideosUploaded = data.sections
      .map((section) => section.lessons)
      .flat()
      .every((lesson) => lesson.videoUrl && lesson.videoUrl.trim() !== '');

    if (!isVideosUploaded)
      throw new Error(
        'Please upload the lesson video before creating the course.',
      );

    const validatedData = createCourseSchema.safeParse(data);

    if (!validatedData.success) throw new Error('Invalid course data');

    const results: {
      id: string;
      videoUrl: string;
      uploadthingFileId: string;
    }[] = [];

    await prisma.$transaction(async (tx) => {
      const newCourse = await tx.course.create({
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

      // Create Sections
      for (const section of validatedData.data.sections) {
        const newSection = await tx.section.create({
          data: {
            title: section.title,
            courseId: newCourse.id,
          },
        });

        // Create Lessons
        for (const lesson of section.lessons) {
          const newLesson = await tx.lesson.create({
            data: {
              title: lesson.title,
              duration: lesson.duration,
              sectionId: newSection.id,
            },
          });
          results.push({
            id: newLesson.id,
            videoUrl: lesson.videoUrl || '',
            uploadthingFileId: lesson.uploadthingFileId || '',
          });
        }
      }
    });

    // Create Mux Asset

    // Note: Using demo video ids for all lessons in the demo course

    for (const lesson of results) {
      //   const muxData = await mux.video.assets.create({
      //     inputs: [{ url: lesson.videoUrl }],
      //     playback_policy: ['public'],
      //   });

      // if (!muxData || !muxData.playback_ids) {
      //   throw new Error('Failed to create Mux asset');
      // }

      // Store Mux Data in the database
      const muxData = await prisma.muxData.create({
        data: {
          lessonId: lesson.id,
          muxAssetId: DEMO_COURSE_VIDEOS.muxAssetId,
          muxPlaybackId: DEMO_COURSE_VIDEOS.muxPlaybackId,
          uploadthingFileId: lesson.uploadthingFileId,
        },
      });

      // Delete uploadThing file key for Demo purpose only
      const utapi = new UTApi();
      await utapi.deleteFiles([muxData.uploadthingFileId]);
    }

    return { success: true, message: 'Course created successfully.' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
