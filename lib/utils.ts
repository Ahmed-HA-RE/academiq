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
