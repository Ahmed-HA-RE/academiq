import { NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/auth';
import { headers } from 'next/headers';
import { SERVER_URL } from './lib/constants';

export const proxy = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname;
  console.log(pathname);

  const Invalid_Token = req.nextUrl.searchParams.get('error');

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname === '/register' && session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname === '/verify-email' && session?.user.emailVerified) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname === '/forgot-password' && session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname === '/reset-password' && (session || Invalid_Token)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (pathname === '/checkout' && !session) {
    return NextResponse.redirect(new URL('/cart', req.url));
  }

  if (pathname === '/success' && !session) {
    return NextResponse.redirect(new URL('/cart', req.url));
  }

  if (pathname === '/my-courses' && !session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname === '/teach/apply' && !session) {
    return NextResponse.redirect(
      new URL(
        `/login?callbackUrl=${SERVER_URL}${req.nextUrl.pathname}`,
        req.url
      )
    );
  }

  // Add cart session id in the cookies
  if (!req.cookies.get('sessionId')) {
    const sessionId = crypto.randomUUID();
    const response = NextResponse.next();
    response.cookies.set('sessionId', sessionId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  }
};

export const config = {
  matcher: [
    '/login',
    '/register',
    '/verify-email',
    '/forgot-password',
    '/reset-password',
    '/checkout',
    '/success',
    '/my-courses',
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
};
