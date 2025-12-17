import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

export const CITY_OPTIONS = [
  { label: 'Abu Dhabi', value: 'abu-dhabi' },
  { label: 'Dubai', value: 'dubai' },
  { label: 'Sharjah', value: 'sharjah' },
  { label: 'Ajman', value: 'ajman' },
  { label: 'Fujairah', value: 'fujairah' },
  { label: 'Ras Al Khaimah', value: 'ras-al-khaimah' },
  { label: 'Umm Al Quwain', value: 'umm-al-quwain' },
];
