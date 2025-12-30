import {
  parseAsInteger,
  parseAsString,
  parseAsArrayOf,
  createLoader,
  parseAsStringLiteral,
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
  search: parseAsString.withDefault(''),
  role: parseAsString.withDefault(''),
  status: parseAsString.withDefault(''),
  paidAt: parseAsString.withDefault(''),
  type: parseAsStringLiteral(['percentage', 'fixed', 'all']).withDefault('all'),
  expiry: parseAsString.withDefault(''),
  limit: parseAsInteger.withDefault(10),
};

export const loadSearchParams = createLoader(coursesfilteredParams);
