export const SERVER_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_PROD_URL
    : process.env.NEXT_PUBLIC_DEV_URL;

export const APP_NAME = 'Academiq';

export const testimonials = [
  {
    name: 'Omar Al-Hakim',
    title: 'Amazing learning experience',
    description:
      'The courses are incredibly well structured and easy to follow. I finally understand topics that used to confuse me!',
    rating: 4.6,
    role: 'Frontend Developer',
    company: 'Amazon',
    image:
      'https://res.cloudinary.com/ahmed--dev/image/upload/v1765127343/review-3_m37iep.jpg',
  },
  {
    name: 'Youssef Nasser',
    title: 'Step-by-step guidance works',
    description:
      'The mentor support and step-by-step lessons make learning so smooth. I feel confident applying what I learned.',
    rating: 5,
    role: 'Software Engineer',
    company: 'PayPal',
    image:
      'https://res.cloudinary.com/ahmed--dev/image/upload/v1765127343/review-2_ck8ljv.jpg',
  },
  {
    name: 'Alex Johnson',
    title: 'Up to date and practical',
    description:
      'The updated curriculum and quizzes helped me grasp complex concepts quickly. Highly recommend for anyone serious about learning.',
    rating: 5,
    role: 'Cloud Data Analyst',
    company: 'Google',
    image:
      'https://res.cloudinary.com/ahmed--dev/image/upload/v1765127342/review-1_dm5bue.jpg',
  },
];
