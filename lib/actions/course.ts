'use server';

import { CreateCourse } from '@/types';
import { Prisma } from '../generated/prisma';
import { prisma } from '../prisma';
import { convertToPlainObject } from '../utils';
import { getCurrentLoggedInInstructor } from './instructor';
import { createCourseSchema } from '@/schema';
import mux from '../mux';
import { uploadToCloudinary } from '../cloudinary';
import { revalidatePath } from 'next/cache';

// Get all courses
export const getAllCourses = async ({
  q,
  rating,
  price,
  difficulty,
  sortBy,
  page = 1,
  limit = 5,
}: {
  q?: string;
  rating?: number[];
  price?: string;
  difficulty?: string[];
  sortBy?: string;
  page?: number;
  limit?: number;
}) => {
  // Query Filter
  const filterQuery: Prisma.CourseWhereInput = q
    ? { title: { contains: q, mode: 'insensitive' } }
    : {};

  // Rating Filter
  const ratingFilter: Prisma.CourseWhereInput =
    rating && rating.length > 0
      ? {
          rating: {
            lte: rating[1],
            gte: rating[0],
          },
        }
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
      ...ratingFilter,
      ...priceFilter,
      ...difficultyFilter,
      ...{},
    },
    orderBy: { ...sortingFilter },
    take: limit,
    skip: (page - 1) * limit,
  });

  const totalCount = await prisma.course.count({
    where: {
      ...filterQuery,
      ...ratingFilter,
      ...priceFilter,
      ...difficultyFilter,
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
  limit = 1,
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
          lessons: true,
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

    const validatedData = createCourseSchema.safeParse(data);

    if (!validatedData.success) throw new Error('Invalid course data');

    const results: { id: string; videoUrl: string }[] = [];

    // Upload Image Cloudinary
    const imageUrl = await uploadToCloudinary(data.imageFile, 'academiq');

    await prisma.$transaction(async (tx) => {
      const newCourse = await tx.course.create({
        data: {
          title: validatedData.data.title,
          description: validatedData.data.description,
          price: validatedData.data.price,
          difficulty: validatedData.data.difficulty,
          category: validatedData.data.category,
          image: imageUrl.secure_url,
          language: validatedData.data.language,
          prequisites: validatedData.data.prequisites,
          instructorId: validatedData.data.instructorId,
          slug: validatedData.data.slug,
          published: validatedData.data.published,
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
            videoUrl: lesson.videoUrl,
          });
        }
      }
    });

    // Create Mux Asset
    for (const lesson of results) {
      const muxData = await mux.video.assets.create({
        inputs: [{ url: lesson.videoUrl }],
        playback_policy: ['public'],
      });

      if (!muxData || !muxData.playback_ids) {
        throw new Error('Failed to create Mux asset');
      }

      // Store Mux Data in the database
      await prisma.muxData.create({
        data: {
          lessonId: lesson.id,
          muxAssetId: muxData.id,
          muxPlaybackId: muxData.playback_ids[0].id as string,
        },
      });
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
