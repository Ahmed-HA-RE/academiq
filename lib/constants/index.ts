import { Option } from '@/app/components/ui/multi-select';
import langes from 'langs';

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
    title: 'Structured and Reliable',
    description:
      'The platform organizes learning in a way that’s intuitive and effective. Students can focus on understanding concepts without getting overwhelmed.',
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

export const faqItems = [
  {
    question: 'What is the payment flow?',
    answer:
      'We use Stripe, a secure and trusted payment system used by millions of businesses worldwide. All transactions are encrypted and protected, ensuring safe payments for both students and instructors.',
  },
  {
    question: 'How much profit will I earn from my courses?',
    answer:
      'We strongly encourage instructors to earn from their hard work! Our platform only takes 5% of the profits from students who purchase your courses. The remaining 95% goes directly to you, the instructor.',
  },
  {
    question: 'How do I receive my payments?',
    answer:
      'Payments are processed securely through Stripe and deposited directly to your bank account or payment method of choice. You can track your earnings in your instructor dashboard and withdraw funds at any time.',
  },
  {
    question: 'What support do you provide for instructors?',
    answer:
      'We provide comprehensive support including content guidelines, technical assistance, marketing tips, and a dedicated instructor support team to help you succeed on our platform.',
  },
  {
    question: 'Can I set my own course prices?',
    answer:
      'Yes! You have complete control over your course pricing. You can set, adjust, and offer discounts on your courses at any time. We recommend competitive pricing based on course value and market research.',
  },
  {
    question: 'How do I get started as an instructor?',
    answer:
      'Simply press the button below to be directed to the application form. Be sure to enter valid data, and our team will review your application within 24 hours. You will receive a response with the next steps.',
  },
];

export const TEACHING_CATEGORIESMULTISELECT: Option[] = [
  {
    value: 'Web Development',
    label: 'Web Development',
    disable: true,
  },
  {
    value: 'Frontend Development',
    label: 'Frontend Development',
  },
  {
    value: 'Backend Development',
    label: 'Backend Development',
  },
  {
    value: 'Mobile Development',
    label: 'Mobile Development',
  },
  {
    value: 'Business',
    label: 'Business',
    disable: true,
  },
  {
    value: 'Enterpreneurship',
    label: 'Enterpreneurship',
  },
  {
    value: 'Marketing',
    label: 'Marketing',
  },
  {
    value: 'Project Management',
    label: 'Project Management',
  },
];

export const validCountryPhones = ['AE', 'SA', 'KW', 'QA', 'OM', 'BH'];

export const USERS_ROLES = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'user',
    label: 'User',
  },
  {
    value: 'admin',
    label: 'Admin',
  },
];

export const TEACHING_CATEGORIES = ['Web Development', 'Business'];

export const COURSE_LANGUAGES = langes.names();

export const DEMO_COURSE_VIDEOS = {
  muxPlaybackId: process.env.NEXT_PUBLIC_DEMO_MUX_PLAYBACK_VIDEO as string,
  muxAssetId: process.env.DEMO_MUX_ASSEST_VIDEO as string,
};
