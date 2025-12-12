import {
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsArrayOf,
  createLoader,
} from 'nuqs/server';

export const coursesfilteredParams = {
  q: parseAsString.withDefault(''),
  rating: parseAsFloat.withDefault(0),
  priceMin: parseAsInteger.withDefault(0),
  priceMax: parseAsInteger.withDefault(0),
  difficulty: parseAsArrayOf(parseAsString).withDefault([]),
};

export const loadSearchParams = createLoader(coursesfilteredParams);
