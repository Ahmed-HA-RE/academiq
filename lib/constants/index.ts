import { Option } from '@/app/components/ui/multi-select';
import langes from 'langs';

export const SERVER_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_PROD_URL
    : process.env.NEXT_PUBLIC_DEV_URL;

export const APP_NAME = 'Academiq';

export const LEARNING_OUTCOMES = [
  {
    title: 'Apply Knowledge in Real Situations',
    description:
      'Gain the ability to confidently apply what you learn to real-life scenarios, projects, and problem-solving situations, rather than relying on memorization or isolated examples.',
  },
  {
    title: 'Develop Independent Learning Confidence',
    description:
      'Build the confidence to approach new topics, tools, or challenges on your own, knowing how to break problems down and find effective solutions.',
  },
  {
    title: 'Strengthen Practical Decision Making Skills',
    description:
      'Learn how to make informed decisions when working through complex tasks by understanding trade-offs, best practices, and common pitfalls.',
  },
];

export const LOGO_CLOUD = [
  {
    image: '/svg/google_logo.svg',
    alt: 'Google',
    size: 'size-14',
  },
  {
    image: '/images/linkedin_logo.png',
    alt: 'LinkedIn',
    size: 'size-14',
  },
  {
    image: '/svg/amazon_logo.svg',
    alt: 'Amazon',
    size: 'size-14',
  },
  {
    image: '/images/shopify_logo.png',
    alt: 'Shopify',
    size: 'size-14',
  },
  {
    image: '/svg/microsoft_logo.svg',
    alt: 'Microsoft',
    size: 'size-14',
  },
  {
    image: '/svg/stripe_logo_circule.svg',
    alt: 'Stripe',
    size: 'size-14',
  },
  {
    image: '/svg/ibm_logo.svg',
    alt: 'IBM',
    size: 'size-14',
  },
  {
    image: '/svg/meta_logo.svg',
    alt: 'Meta',
    size: 'size-15',
  },
  {
    image: '/svg/slack_logo.svg',
    alt: 'Slack',
    size: 'size-15',
  },
];

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
  {
    name: 'Michael Roberts',
    title: 'Support that actually helps',
    description:
      'The support experience is excellent. Questions are handled quickly, guidance feels thoughtful rather than generic, and the group chat support is also top notch.',
    rating: 4.8,
    role: 'Product Manager',
    company: 'Slack',
    image:
      'https://res.cloudinary.com/ahmed--dev/image/upload/v1764700356/avatars/jc5t8yphb1crsomdpyo2.jpg',
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
      'Yes! You have complete control over your course pricing. We recommend competitive pricing based on course value and market research.',
  },
  {
    question: 'How do I get started as an instructor?',
    answer:
      'Simply press the button below to be directed to the application form. Be sure to enter valid data, and our team will review your application within 24 hours. You will receive a response with the next steps.',
  },
];

export const pricingFaqItems = [
  {
    question: 'What plans do you offer?',
    answer:
      'We offer two subscription plans: a Monthly plan for flexible access and a Yearly plan that gives you the best value with full access to all courses for a lower overall cost.',
  },
  {
    question: 'What is the difference between the Monthly and Yearly plans?',
    answer:
      'Both plans give you access to the same courses and learning content. The Yearly plan is billed once per year and saves you money compared to paying monthly.',
  },
  {
    question: 'Can I cancel my subscription at any time?',
    answer:
      'Yes. You can cancel your subscription at any time from your account settings. Your access will remain active until the end of the current billing period.',
  },
  {
    question: 'What happens after I cancel?',
    answer:
      'After cancellation, you will keep access to the platform until your current subscription period ends. You will not be charged again unless you resubscribe.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'Refunds depend on your billing cycle and usage. Please contact our support if you believe you were charged incorrectly.',
  },
  {
    question: 'How do I get help if I have billing or plan questions?',
    answer:
      'You can contact our support team through the community or email. Pro subscribers receive priority support and faster response times.',
  },
];

export const TEACHING_CATEGORY_OPTIONS: Option[] = [
  { value: 'Web Development', label: 'Web Development', disable: true },
  { value: 'Frontend Development', label: 'Frontend Development' },
  { value: 'Backend Development', label: 'Backend Development' },
  { value: 'Fullstack Development', label: 'Fullstack Development' },

  { value: 'UX/UI Design', label: 'UX/UI Design', disable: true },
  { value: 'UX Research', label: 'UX Research' },
  { value: 'UI Design', label: 'UI Design' },
  { value: 'Design Systems', label: 'Design Systems' },

  { value: 'Data Science', label: 'Data Science', disable: true },
  { value: 'Machine Learning', label: 'Machine Learning' },
  { value: 'Data Analysis', label: 'Data Analysis' },

  { value: 'Business', label: 'Business', disable: true },
  { value: 'Entrepreneurship', label: 'Entrepreneurship' },
  { value: 'Project Management', label: 'Project Management' },
  { value: 'Marketing', label: 'Marketing' },
];
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

export const TEACHING_CATEGORIES = [
  'All',
  'Web Development',
  'Business',
  'UX/UI Design',
  'Data Science',
  'Marketing',
];
export const COURSE_LANGUAGES = langes.names();

export const DEMO_COURSE_VIDEOS = {
  muxPlaybackId: process.env.NEXT_PUBLIC_DEMO_MUX_PLAYBACK_VIDEO as string,
  muxAssetId: process.env.DEMO_MUX_ASSEST_VIDEO as string,
};

export const APPLICATION_FEE_PERCENTAGE = 20; // 20% application fee

export const COURSE_TABS_TRIGGER = [
  { label: 'About Course', value: 'about-course' },
  { label: 'Course Content', value: 'course-content' },
  { label: 'Reviews', value: 'reviews' },
];

export const CONTACT_US_FEATURES = [
  {
    title: 'Personalized Support',
    description:
      'Our team is here to provide you with tailored assistance that meets your unique needs.',
  },
  {
    title: 'Fast & Friendly Support',
    description:
      'We pride ourselves on delivering quick and friendly support to ensure your satisfaction.',
  },
  {
    title: 'Expert Guidance',
    description:
      'Our knowledgeable team is ready to offer expert guidance to help you navigate any challenges.',
  },
];

export const OUR_TEAM = [
  {
    image: '/images/team/ceo.jpg',
    alt: 'Alex Johnson',
    name: 'Alex Johnson',
    role: 'CEO & Founder',
    description:
      'Founded Academiq to simplify learning and connect instructors worldwide through an accessible, affordable LMS.',
  },
  {
    image: '/images/team/head-of-learning-experience.jpg',
    alt: 'Rami Al-Haddad',
    name: 'Yazan Al-Haddad',
    role: 'Payments & Security Engineering',
    description:
      'Builds and maintains secure payment systems, billing flows, and data protection across the platform.',
  },
  {
    image: '/images/team/head-of-instructor-success.jpg',
    alt: 'Khaled Al-Najjar',
    name: 'Khaled Al-Najjar',
    role: 'Instructor Publishing Tools',
    description:
      'Develops the tools and workflows instructors use to upload, manage, and publish their own courses on Academiq.',
  },
];

export const PLANS = [
  {
    name: 'basic',
    price: 100,
    description:
      'Ideal for learners who want flexible monthly access to high-quality courses and community support.',
    features: [
      'Access to all available courses',
      'HD video streaming',
      'Learn at your own pace',
      'Community support & discussions',
      'Instructor answers via community',
      'Downloadable learning resources',
    ],
    billCycle: 'month',
  },
  {
    name: 'pro',
    price: 900,
    description:
      'Best value for committed learners. Get unlimited access for a full year and save 300 AED compared to monthly billing.',
    features: [
      'Unlimited access to all courses',
      'Save 300 AED compared to monthly plan (25%)',
      'Priority support from instructors',
      'Faster responses in community discussions',
      'HD video streaming',
      'Access to all future courses during your plan',
      'Downloadable learning resources',
    ],
    billCycle: 'year',
    isHighlighted: true,
    popular: true,
  },
];
