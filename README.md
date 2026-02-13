# Academiq — LMS SaaS Platform

Academiq is a full-stack Learning Management System (LMS) built with modern web technologies to enable instructors to create, manage, and monetize courses while providing learners with an engaging, structured learning experience.

It focuses on real-world skill development, scalable course delivery, and a production-ready architecture for modern education platforms.

### ✨ Overview

Academiq is designed as a professional LMS platform that includes:

- Course creation and management
- Student learning workflows
- Subscription-based access
- Instructor tools
- Progress tracking
- Video delivery and content hosting
- Authentication and billing

> Built using the latest ecosystem around Next.js, React, Prisma, and Stripe.

### 🚀 Features

#### 🎓 Learning Experience

- Course enrollment & library system
- Lesson progression tracking
- Video-based learning delivery
- Interactive course structure
- Resume learning from last lesson

#### 🧑‍🏫 Instructor Tools

- Course creation workflow
- Lesson and module organization
- Rich text editor for course content
- Upload media and learning resources
- Student engagement insights

#### 💳 Subscription & Payments

- Stripe subscription integration
- Coupon support
- Plan upgrades and billing flows
- Secure payment handling

#### 🔐 Authentication & User Management

- Secure auth with Better Auth
- Session management
- Role-based access (students / instructors / admin)
- OAuth support

#### 📊 Progress & Engagement

- Course progress tracking
- Completion logic
- Learning analytics foundations
- Student dashboards

#### 📧 Notifications & Communication

- Email delivery system
- Transactional notifications
- User activity updates

#### 🎥 Media & Content

- Video hosting and streaming
- Asset optimization

### 🧰 Tech Stack

#### Frontend

- Next.js 16
- React 19
- Tailwind CSS 4
- Radix UI
- Motion / animations
- TanStack Table
- DND Kit
- TipTap editor
- Knock Notifications
- Zustand for state management

#### Backend

- Prisma ORM
- PostgreSQL / Neon
- Server actions & API routes
- Better Auth
- Zod for validation
- Resend for email delivery
- Nuqs for URL Filtering
- Upstash for rate limiting
- File storage integrations

#### Payments

- Stripe SDK
- Subscription flows
- Coupons & billing logic

#### Media & Uploads

- Mux video streaming
- UploadThing
- Cloudinary

### Screenshots 📸

![Screen 1](/public/images/screen/screen-1.png)
![Screen 2](/public/images/screen/screen-2.png)
![Screen 3](/public/images/screen/screen-3.png)

### ⚠️ Development Note

> Stripe integration in this project runs in test mode only. No real payment data, transactions, or financial information are used or stored.

### ⚙️ Getting Started

To run Academiq locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/Ahmed-HA-RE/academiq.git
    cd academiq
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:

```

NEXT_PUBLIC_PROD_URL=
NEXT_PUBLIC_DEV_URL=http://localhost:3000
NEXT_PUBLIC_DEV_EMAIL_URL=http://localhost:3001
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
RESEND_API_KEY=
EMAIL_SENDER=
RESEND_DOMAIN=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET=
NEXT_PUBLIC_STRIPE_KEY=
STRIPE_WEBHOOK_SECRET_PROD=
STRIPE_WEBHOOK_SECRET_DEV=
STRIPE_PLUGIN_WEBHOOK_SECRET_PROD=
STRIPE_PLUGIN_WEBHOOK_SECRET_DEV=
STRIPE_BASIC_PRICE_ID=
STRIPE_PRO_PRICE_ID=
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET=
REPLY_EMAIL=
UPLOADTHING_TOKEN=
UPLOADTHING_SECRET=
UPLOADTHING_APPID=
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
MUX_SECRET=
NEXT_PUBLIC_DEMO_MUX_PLAYBACK_VIDEO=
DEMO_MUX_ASSEST_VIDEO=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY=
NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID=
KNOCK_API_KEY=
KNOCK_SIGNING_KEY=
```

4. Run database migrations:
   ```
   npx prisma migrate dev
   ```
5. Start the development server:
   ```
   npm run dev
   ```

### License 📄

Ahmed Haitham Rehan. All rights reserved.
