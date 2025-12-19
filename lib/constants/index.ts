export const SERVER_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_PROD_URL
    : process.env.NEXT_PUBLIC_DEV_URL;

export const APP_NAME = 'Academiq';

export const testimonials = [
  {
    name: 'John Doe',
    title: 'Amazing learning experience',
    description:
      'The courses are incredibly well structured and easy to follow. I finally understand topics that used to confuse me!',
    rating: 4.6,
    role: 'Frontend Developer',
    company: 'DigitalOcean',
    image:
      'https://res.cloudinary.com/ahmed--dev/image/upload/v1765127343/review-3_m37iep.jpg',
  },
  {
    name: 'Robert Smith',
    title: 'Step-by-step guidance works',
    description:
      'The mentor support and step-by-step lessons make learning so smooth. I feel confident applying what I learned.',
    rating: 4.5,
    role: 'Software Engineer',
    company: 'Stripe',
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
    company: 'Cloudflare',
    image:
      'https://res.cloudinary.com/ahmed--dev/image/upload/v1765127342/review-1_dm5bue.jpg',
  },
];

export const checklist = [
  {
    value: 'Strong Subject Understanding',
    description:
      'You have a solid grasp of the topic you want to teach and can break down ideas into clear, easy-to-follow lessons.',
  },
  {
    value: 'Clear Communication Skills',
    description:
      'You are able to explain concepts in a structured and understandable way, whether through video, text, or examples.',
  },
  {
    value: 'Commitment to Student Learning',
    description:
      'You are willing to support learners by answering questions, updating content when needed, and guiding them through the course.',
  },
  {
    value: 'Professional Responsibility',
    description:
      'You agree to follow platform guidelines, respect learners, and maintain a professional and ethical teaching environment.',
  },
];
