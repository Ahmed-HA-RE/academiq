import { NextRequest, NextResponse } from 'next/server';

import { SERVER_URL } from './lib/constants';
import { getCurrentLoggedUser } from './lib/actions/user';

export const proxy = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname;

  const Invalid_Token = req.nextUrl.searchParams.get('error');

  const user = await getCurrentLoggedUser();

  if (pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname === '/register' && user) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname === '/verify-email' && user?.emailVerified) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname === '/forgot-password' && user) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname === '/reset-password' && (user || Invalid_Token)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (pathname === '/checkout' && !user) {
    return NextResponse.redirect(new URL('/cart', req.url));
  }

  if (pathname === '/success' && !user) {
    return NextResponse.redirect(new URL('/cart', req.url));
  }

  if (pathname === '/my-courses' && !user) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname === '/teach/apply' && !user) {
    return NextResponse.redirect(
      new URL(
        `/login?callbackUrl=${SERVER_URL}${req.nextUrl.pathname}`,
        req.url
      )
    );
  }
  if (
    pathname.startsWith('/admin-dashboard') &&
    (!user || user.role !== 'admin')
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Add cart user id in the cookies
  if (!req.cookies.get('userId')) {
    const userId = crypto.randomUUID();
    const response = NextResponse.next();
    response.cookies.set('userId', userId, {
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
    '/admin-dashboard/:path*',
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
};
