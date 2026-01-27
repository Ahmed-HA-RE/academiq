import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getNames } from 'country-list';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertToPlainObject = <T>(data: T): T => {
  return JSON.parse(JSON.stringify(data));
};

// Format date to a more readable format
export const formatDate = (date: Date, type: 'date' | 'dateTime') => {
  if (type === 'dateTime') {
    const dateTime = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      hour: 'numeric',
      month: 'numeric',
      year: 'numeric',
      minute: 'numeric',
    }).format(date);
    return dateTime;
  } else {
    const dateOnly = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).format(date);
    return dateOnly;
  }
};

export const PRICE_RANGE = [
  { label: 'Under 50 AED', value: '0-50' },
  { label: '50-100 AED', value: '50-100' },
  { label: '100-200 AED', value: '100-200' },
  { label: '200-500 AED', value: '200-500' },
  { label: 'Above 1000 AED', value: '1000' },
];

export const DIFFICULTY_LEVELS = [
  { label: 'Beginner', value: 'BEGINNER' },
  { label: 'Intermediate', value: 'INTERMEDIATE' },
  { label: 'Advanced', value: 'ADVANCED' },
];

export const SORTING_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

export const LIST_COUNTRIES = getNames().filter(
  (country) => country !== 'Israel' && country !== 'Christmas Island',
);

export const formatId = (id: string) => {
  return id.slice(id.length - 7);
};

export const UAE_CITIES = [
  'Abu Dhabi',
  'Dubai',
  'Sharjah',
  'Al Ain',
  'Ajman',
  'Fujairah',
  'Ras Al Khaimah',
  'Umm Al Quwain',
];

export const FAQ_TABS = [
  {
    name: 'Getting Started',
    value: 'getting-started',
    faqs: [
      {
        question: 'Why am I only seeing the UAE?',
        answer:
          'Our instructor program currently accepts applicants located in the UAE due to local regulatory, payment, and verification requirements. We plan to expand to other countries in future releases.',
      },
      {
        question: 'How do I become an instructor?',
        answer:
          'Sign up, complete your instructor profile, upload required verification documents, and submit your application. We review applications to ensure quality and compliance.',
      },
      {
        question: 'What are the verification requirements?',
        answer:
          'Verification typically includes identity documents and payment details. Requirements vary by country and are used to comply with local regulations.',
      },
      {
        question: 'How long does approval take?',
        answer:
          'Approvals usually take a few business days depending on document completeness and verification load.',
      },
    ],
  },
  {
    name: 'Course Creation',
    value: 'course-creation',
    faqs: [
      {
        question: 'How do I create my first course?',
        answer:
          'From your instructor dashboard, click "Create Course", add curriculum, set pricing, and publish when ready. Use drafts to prepare before publishing.',
      },
      {
        question: 'Can I edit a course after publishing?',
        answer:
          'Yes — you can update video lessons, descriptions, and pricing. Major changes may trigger a brief review.',
      },
      {
        question: 'How should I structure lessons?',
        answer:
          'Break content into short, focused lessons with clear learning objectives.',
      },
      {
        question: 'Do you provide course templates or assets?',
        answer:
          'We offer basic templates and best-practice guides to help structure content.',
      },
    ],
  },
  {
    name: 'Payments & Payouts',
    value: 'payments',
    faqs: [
      {
        question: 'How do I get paid?',
        answer:
          'Instructors receive payouts via connected payment accounts following our payout schedule. Make sure your payment details are up to date in your instructor settings.',
      },
      {
        question: 'When are payouts processed?',
        answer:
          'Payout timing depends on sales and local payout processing. Check the payout schedule in your instructor dashboard for details.',
      },
      {
        question: 'Are payouts taxed?',
        answer:
          'Tax obligations depend on your jurisdiction. We provide reports to consult a local tax advisor for specifics.',
      },
      {
        question: 'What payment methods are supported?',
        answer:
          'We support major card payments for learners and instructors. Payout methods depend on country and connected providers.',
      },
    ],
  },
  {
    name: 'Policies & Support',
    value: 'policies',
    faqs: [
      {
        question: 'What are the content policies?',
        answer:
          'Content must follow our community guidelines no illegal, hateful, or plagiarized material. We reserve the right to remove content that violates policies.',
      },
      {
        question: 'How do I request support?',
        answer:
          'Use the Help Center or contact support from your dashboard for account, payments, or course-related issues.',
      },
      {
        question: 'How do refunds work?',
        answer:
          'Refunds are handled per course and instructor policies. If a refund is approved, learners are refunded via their original payment method.',
      },
    ],
  },
];

export const convertToFils = (price: string) => {
  return Math.round(Number(price) * 100);
};

// Utility type to deeply omit a property from a nested object type
export type NestedOmit<Schema, Path extends string> = Schema extends (infer U)[]
  ? NestedOmit<U, Path>[]
  : Path extends `${infer Head}.${infer Tail}`
    ? Head extends keyof Schema
      ? {
          [K in keyof Schema]: K extends Head
            ? NestedOmit<Schema[K], Tail>
            : Schema[K];
        }
      : Schema
    : Omit<Schema, Path>;

export const formatDuration = (durationInMinutes: number) => {
  dayjs.extend(duration);
  const parseDuration = dayjs.duration(durationInMinutes, 'minute');
  const formatDuration =
    Number(durationInMinutes) < 60
      ? `${parseDuration.minutes()} min`
      : `${parseDuration.hours()} hr ${parseDuration.minutes()} min`;
  return formatDuration;
};
