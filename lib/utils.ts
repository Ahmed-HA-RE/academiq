import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertToPlainObject = <T>(data: T): T => {
  return JSON.parse(JSON.stringify(data));
};

// Format date to a more readable format
export const formatDate = (dateString: string, type: 'date' | 'dateTime') => {
  if (type === 'dateTime') {
    const dateTime = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      hour: 'numeric',
      month: 'numeric',
      year: 'numeric',
      minute: 'numeric',
    }).format(new Date(dateString));
    return dateTime;
  } else {
    const date = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).format(new Date(dateString));
    return date;
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
