import {
  parseAsInteger,
  parseAsString,
  parseAsArrayOf,
  createLoader,
} from 'nuqs/server';

export const coursesfilteredParams = {
  q: parseAsString.withDefault(''),
  rating: parseAsArrayOf(parseAsInteger, '-').withDefault([1, 5]).withOptions({
    clearOnDefault: false,
  }),
  price: parseAsString.withDefault(''),
  difficulty: parseAsArrayOf(parseAsString).withDefault([]),
  sortBy: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
};

export const loadSearchParams = createLoader(coursesfilteredParams);
