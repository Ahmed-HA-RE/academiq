import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create a new ratelimiter, that allows 5 requests per 15 seconds
const ratelimit = new Ratelimit({
  redis: new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
  }),
  limiter: Ratelimit.slidingWindow(5, '15 s'),
  analytics: true,
  prefix: '@upstash/ratelimit',
});

export default ratelimit;
