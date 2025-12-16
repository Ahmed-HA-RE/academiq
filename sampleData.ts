export const sampleInstructors = [
  {
    id: '1221d4f1c3e8-7b9a-4a2f-8b67-1f2c9d5e6aqw',
    name: 'Dania Haitham Rehan',
    bio: 'Dania is a senior full-stack instructor with over 8 years of experience teaching modern web technologies. She specializes in JavaScript, React, and scalable backend systems, and is known for her clear teaching style and hands-on project-driven curriculum.',
    job: 'Senior Full Stack Instructor',
    address: 'Dubai, UAE',
    avatar:
      'https://res.cloudinary.com/ahmed--dev/image/upload/v1765463809/dania_klajug.avif',
    email: 'dania@example.com',
    phone: '+971525418274',
    birthDate: '1993-06-14T00:00:00.000Z',
    socialLinks: {
      instagram: 'https://www.instagram.com',
      linkedin: 'https://www.linkedin.com',
    },
    coursesId: ['1', '2', '3'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const sampleDiscounts = [
  {
    code: 'WINTER26',
    amount: 10,
    type: 'percentage',
    stripeCouponId: 'LmS2SxPT',
    validUntil: new Date('2025-12-20T22:00:00'),
  },
];

export const coursesSample = [
  {
    slug: 'nextjs-complete-guide',
    title: 'Next.js Complete Guide',
    description:
      'This comprehensive Next.js course takes you from the fundamentals to building real-world, production-ready applications. You will learn everything from file-based routing, layouts, and dynamic routes to advanced rendering strategies such as Server-Side Rendering (SSR), Static Site Generation (SSG), and Incremental Static Regeneration (ISR). The course also covers API Routes, middlewares, SEO optimization, deployment best practices, image optimization, and server actions. By the end, you will have the skills to confidently architect scalable full-stack applications with Next.js and modern frontend patterns.',
    price: 199.99,
    isFeatured: true,
    image:
      'https://res.cloudinary.com/ahmed--dev/image/upload/v1764955258/Z1_3cpbqstJ98iN__a-complete-guide-to-next-js-a-react-js-framework_vtgjcl.avif',
    language: 'English',
    prequisites:
      'Students should have a solid understanding of modern JavaScript (ES6+) including variables, functions, arrays, objects, and asynchronous concepts such as promises and async/await. Prior experience with React is required, including knowledge of components, props, state, hooks, and basic component composition. Familiarity with HTML5 and CSS3 is expected, along with a basic understanding of Git and npm/yarn workflows. No prior Next.js experience is required, but experience building small React applications will help you progress faster.',
    difficulty: 'INTERMEDIATE',
    rating: 4.7,
    numReviews: 120,
    duration: 70,
    currentPrice: 149.99,
  },
  {
    slug: 'react-modern-course',
    title: 'React Modern Course',
    description:
      'A complete deep dive into modern React, focusing on practical patterns and best practices used by today’s top companies. You will start with foundational concepts like components, props, and state, then progressively move into advanced topics including hooks, context, performance optimization, memoization, custom hooks, reusable patterns, and scalable application structure. The course emphasizes building maintainable code, thinking in components, and mastering real-world workflows used in professional React development.',
    price: 149.99,
    isFeatured: true,
    image:
      'https://res.cloudinary.com/ahmed--dev/image/upload/v1764955097/course-2_iqntfn.png',
    language: 'English',
    prequisites:
      'A basic understanding of JavaScript fundamentals is required, including variables, functions, arrays, objects, and control flow. Learners should be comfortable with HTML and CSS basics, such as semantic markup and basic styling. No prior React experience is required, as the course starts from the fundamentals and gradually builds toward advanced concepts. Familiarity with ES6 syntax (arrow functions, destructuring, modules) is helpful but not mandatory.',
    difficulty: 'BEGINNER',
    rating: 4.5,
    duration: 90,
    numReviews: 95,
    currentPrice: 149.99,
  },
  {
    slug: 'nodejs-api-development',
    title: 'Node.js API Development',
    description:
      'Learn how to build secure, scalable, and flexible backend APIs using Node.js and Express. This course guides you through setting up servers, handling routing, interacting with databases, implementing authentication and authorization, designing RESTful architectures, and adding middleware for logging, validation, and error handling. You will also work with MongoDB to build persistent data models and learn how to deploy your API to production cloud environments. Perfect for anyone aiming to master backend development.',
    price: 129.99,
    isFeatured: false,
    image:
      'https://res.cloudinary.com/ahmed--dev/image/upload/v1764955099/course-5_wd74k2.png',
    language: 'English',
    prequisites:
      'Students should have a good grasp of JavaScript fundamentals and be comfortable working with functions, objects, arrays, and asynchronous code. Basic knowledge of Node.js concepts such as npm, modules, and running scripts is recommended. Familiarity with HTTP concepts (requests, responses, status codes) and REST principles will be helpful. Prior experience with frontend development or consuming APIs is a plus but not required.',
    difficulty: 'INTERMEDIATE',
    rating: 4.6,
    duration: 70,
    numReviews: 80,
    currentPrice: 129.99,
  },
  {
    slug: 'bootstrap-responsive-design',
    title: 'Bootstrap Responsive Design',
    description:
      'This course teaches you how to design beautiful, responsive websites using Bootstrap 5. You will master the grid system, flex utilities, spacing utilities, and pre-built components to rapidly build professional layouts. The course also covers best practices for mobile-first development, reusable design patterns, and customizing Bootstrap to match brand identity. You will build real-world UI components, landing pages, and responsive layouts suitable for modern web applications.',
    price: 99.99,
    isFeatured: false,
    image:
      'https://res.cloudinary.com/ahmed--dev/image/upload/v1765550009/bootstrap-course_zfazwo.webp',
    language: 'English',
    prequisites:
      'Learners should have a basic understanding of HTML structure and CSS fundamentals, including classes, selectors, and basic layout concepts. No prior experience with Bootstrap is required. Familiarity with responsive design concepts such as mobile-first layouts and breakpoints will be helpful, but everything needed to follow along will be explained throughout the course.',
    difficulty: 'BEGINNER',
    rating: 4.3,
    duration: 35,
    numReviews: 50,
    currentPrice: 99.99,
  },
  {
    slug: 'tailwindcss-masterclass',
    title: 'Tailwind CSS Masterclass',
    description:
      'A complete guide to using Tailwind CSS for building stunning, responsive, and highly customizable interfaces. This course walks you through utility-first styling, responsive design patterns, typography, spacing, colors, and component structure. You will learn how to rapidly prototype designs and then build complete UIs with production-quality code. Advanced topics include customizing themes, using Tailwind plugins, optimizing for performance, and integrating Tailwind into frameworks like Next.js.',
    price: 119.99,
    isFeatured: true,
    image:
      'https://res.cloudinary.com/ahmed--dev/image/upload/v1765549332/tailwind-course_fdlmix.png',
    language: 'English',
    prequisites:
      'Students should be comfortable with HTML and CSS fundamentals, including layout concepts such as flexbox or grid. Prior experience building simple web pages is recommended. No previous Tailwind CSS experience is required. Familiarity with modern frontend workflows and frameworks like React or Next.js is helpful but not mandatory.',
    difficulty: 'INTERMEDIATE',
    rating: 4.8,
    numReviews: 110,
    duration: 70,
    currentPrice: 59.99,
  },
  {
    slug: 'javascript-basics-to-advanced',
    title: 'JavaScript Basics to Advanced',
    description:
      'A full JavaScript journey from foundational concepts to advanced programming techniques. You will begin with variables, functions, arrays, loops, and DOM manipulation before moving into ES6+ features like modules, async/await, classes, and modern syntax. The advanced section covers closures, prototypes, event loop internals, promises, and functional programming patterns. By the end, you will be equipped to write clean, modern JavaScript and understand the language deeply.',
    price: 139.99,
    isFeatured: false,
    image:
      'https://res.cloudinary.com/ahmed--dev/image/upload/v1764955096/course-4_hmumxz.jpg',
    language: 'English',
    prequisites:
      'No prior programming experience is required. This course starts from the very basics and gradually progresses to advanced JavaScript concepts. A basic understanding of how websites work and familiarity with HTML is helpful but not required. This course is suitable for absolute beginners as well as developers who want to strengthen their JavaScript foundations.',
    difficulty: 'BEGINNER',
    rating: 4.4,
    duration: 70,
    numReviews: 75,
    currentPrice: 139.99,
  },
  {
    slug: 'mongodb-database',
    title: 'MongoDB Database',
    description:
      'Learn how to work with MongoDB, one of the most popular NoSQL databases used in modern applications. This course covers essentials like collections, documents, indexing, querying, and schema design. You will also integrate MongoDB with Node.js to build fully functioning CRUD systems. Advanced topics include aggregation pipelines, performance optimization, relationships in NoSQL data models, and deploying MongoDB in cloud environments. Ideal for developers building data-driven applications.',
    price: 129.99,
    isFeatured: false,
    image:
      'https://res.cloudinary.com/ahmed--dev/image/upload/v1764955096/course-1_fcyso6.jpg',
    language: 'English',
    prequisites:
      'Students should have a basic understanding of JavaScript and some experience with Node.js. Familiarity with backend concepts such as APIs and data persistence is recommended. No prior database experience is required, but knowledge of basic CRUD operations and JSON data structures will help learners grasp concepts more quickly.',
    difficulty: 'INTERMEDIATE',
    rating: 4.6,
    duration: 60,
    numReviews: 60,
    currentPrice: 129.99,
  },
];
