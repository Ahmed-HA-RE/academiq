'use server';

import { CreateCourse } from '@/types';
import { Prisma } from '../generated/prisma';
import { prisma } from '../prisma';
import { convertToPlainObject } from '../utils';
import { getCurrentLoggedInInstructor } from './instructor';
import { createCourseSchema } from '@/schema';
import mux from '../mux';
import { revalidatePath } from 'next/cache';
import { UTApi } from 'uploadthing/server';
import { DEMO_COURSE_VIDEOS } from '../constants';

// Get all courses
export const getAllCourses = async ({
  q,
  price,
  difficulty,
  category,
  sortBy,
  page = 1,
  limit = 10,
}: {
  q?: string;
  price?: string;
  difficulty?: string[];
  category?: string[];
  sortBy?: string;
  page?: number;
  limit?: number;
}) => {
  // Query Filter
  const filterQuery: Prisma.CourseWhereInput = q
    ? { title: { contains: q, mode: 'insensitive' } }
    : {};

  // Price Filter
  const priceFilter: Prisma.CourseWhereInput =
    price && price.includes('-')
      ? {
          price: {
            lte: Number(price.split('-')[1]),
            gte: Number(price.split('-')[0]),
          },
        }
      : price
        ? {
            price: { gte: Number(price) },
          }
        : {};

  // Difficulty Filter
  const difficultyFilter: Prisma.CourseWhereInput =
    difficulty && difficulty.length > 0
      ? {
          difficulty: { in: difficulty },
        }
      : {};

  // Category Filter
  const categoryFilter: Prisma.CourseWhereInput =
    category && category.length > 0
      ? {
          category: { in: category },
        }
      : {};

  // Sorting Filter
  const sortingFilter: Prisma.CourseOrderByWithRelationInput =
    sortBy === 'newest'
      ? { createdAt: 'asc' }
      : sortBy === 'oldest'
        ? { createdAt: 'desc' }
        : sortBy === 'price-asc'
          ? { price: 'asc' }
          : sortBy === 'price-desc'
            ? { price: 'desc' }
            : {};

  const courses = await prisma.course.findMany({
    where: {
      ...filterQuery,
      ...priceFilter,
      ...difficultyFilter,
      ...categoryFilter,
    },
    orderBy: { ...sortingFilter },
    take: limit,
    skip: (page - 1) * limit,
    include: {
      instructor: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
              id: true,
              email: true,
              banned: true,
              role: true,
            },
          },
        },
      },
    },
  });

  const totalCount = await prisma.course.count({
    where: {
      ...filterQuery,
      ...priceFilter,
      ...difficultyFilter,
      ...categoryFilter,
    },
  });

  const totalPages = Math.ceil(totalCount / limit);

  if (!courses) throw new Error('No courses found');

  return convertToPlainObject({ courses, totalPages });
};

// Get course by slug
export const getCourseBySlug = async (slug: string) => {
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      users: true,
      instructor: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
              id: true,
              email: true,
              banned: true,
              role: true,
            },
          },
        },
      },
      sections: {
        include: {
          lessons: {
            include: {
              muxData: {
                select: {
                  muxAssetId: true,
                  muxPlaybackId: true,
                  uploadthingFileId: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return convertToPlainObject(course);
};

// Get total courses count
export const getTotalCoursesCount = async () => {
  const count = await prisma.course.count();
  return count;
};

export const getAllInstructorCourses = async ({
  status,
  q,
  limit = 10,
  page,
}: {
  status?: string;
  q?: string;
  limit?: number;
  page?: number;
}) => {
  const instructor = await getCurrentLoggedInInstructor();

  const courses = await prisma.course.findMany({
    where: {
      instructorId: instructor.id,
      ...(status === 'published'
        ? { published: true }
        : status === 'unpublished'
          ? { published: false }
          : {}),
      ...(q ? { title: { contains: q, mode: 'insensitive' } } : {}),
    },
    include: {
      _count: {
        select: {
          users: true,
        },
      },

      sections: {
        include: {
          lessons: {
            include: {
              muxData: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip: page ? (page - 1) * limit : 0,
  });

  const totalCourses = await prisma.course.count({
    where: {
      instructorId: instructor.id,
      ...(status === 'published'
        ? { published: true }
        : status === 'unpublished'
          ? { published: false }
          : {}),
      ...(q ? { title: { contains: q, mode: 'insensitive' } } : {}),
    },
  });

  const totalPages = Math.ceil(totalCourses / limit);

  return {
    courses: courses.map((course) =>
      convertToPlainObject({
        ...course,
        studentsCount: course._count.users,
      })
    ),
    totalPages,
  };
};

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
        'Please upload all lesson videos before creating the course.'
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

// Toogle course publish status
export const toggleCoursePublishStatus = async (courseId: string) => {
  try {
    const instructor = await getCurrentLoggedInInstructor();

    const course = await prisma.course.findUnique({
      where: { id: courseId, instructorId: instructor.id },
    });

    if (!course) throw new Error('Course not found');

    await prisma.course.update({
      where: { id: course.id, instructorId: course.instructorId },
      data: { published: !course.published },
    });

    revalidatePath('/instructor-dashboard/courses');

    return {
      success: true,
      message: `Course ${course.published ? 'Unpublished' : 'Published'} successfully.`,
    };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

// Update course
export const updateCourse = async (courseId: string, data: CreateCourse) => {
  try {
    const instructor = await getCurrentLoggedInInstructor();

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
        'Please upload all new lesson videos before updating the course.'
      );

    const validatedData = createCourseSchema.safeParse(data);

    console.log(validatedData.data?.price);

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

    revalidatePath('/instructor-dashboard/courses');
    return { success: true, message: 'Course updated successfully.' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

// Delete course sections
export const deleteCourseSections = async (sectionId: string | undefined) => {
  try {
    const instructor = await getCurrentLoggedInInstructor();

    if (sectionId) {
      const section = await prisma.section.findUnique({
        where: {
          id: sectionId,
          course: {
            instructorId: instructor.id,
          },
        },
      });

      if (!section) {
        throw new Error(
          'Section not found or you do not have permission to delete it'
        );
      }

      await prisma.section.deleteMany({
        where: {
          id: section.id,
          course: {
            instructorId: instructor.id,
          },
        },
      });
    }
    revalidatePath('/', 'layout');
    return { success: true, message: 'Section deleted successfully.' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

// Delete course lessons
export const deleteCourseLessons = async (lessonId: string | undefined) => {
  try {
    const instructor = await getCurrentLoggedInInstructor();

    if (lessonId) {
      const lesson = await prisma.lesson.findUnique({
        where: {
          id: lessonId,
          section: {
            course: {
              instructorId: instructor.id,
            },
          },
        },
      });

      if (!lesson) {
        throw new Error(
          'Lesson not found or you do not have permission to delete it'
        );
      }

      await prisma.lesson.deleteMany({
        where: {
          id: lesson.id,
          section: {
            course: {
              instructorId: instructor.id,
            },
          },
        },
      });
    }
    revalidatePath('/', 'layout');
    return { success: true, message: 'Lesson deleted successfully.' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
