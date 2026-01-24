import { NextRequest, NextResponse } from 'next/server';

import { SERVER_URL } from './lib/constants';
import { getCurrentLoggedUser } from './lib/actions/getUser';

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

  if (pathname === '/cart' && !user) {
    return NextResponse.redirect(
      new URL(
        `/login?callbackUrl=${SERVER_URL}${req.nextUrl.pathname}`,
        req.url,
      ),
    );
  }

  if (pathname === '/checkout' && !user) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname === '/success' && !user) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname === '/my-courses' && !user) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname === '/teach/apply' && !user) {
    return NextResponse.redirect(
      new URL(
        `/login?callbackUrl=${SERVER_URL}${req.nextUrl.pathname}`,
        req.url,
      ),
    );
  }

  if (pathname === '/application/status' && !user) {
    return NextResponse.redirect(new URL('/teach/apply', req.url));
  }

  if (
    pathname.startsWith('/instructor-dashboard') &&
    (!user || user.role !== 'instructor')
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (
    pathname.startsWith('/admin-dashboard') &&
    (!user || user.role !== 'admin')
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname === '/teach/apply/payments/setup' && !user) {
    return NextResponse.redirect(new URL('/teach', req.url));
  }

  if (pathname === '/teach' && user && user.role === 'instructor') {
    return NextResponse.redirect(new URL('/instructor-dashboard', req.url));
  }
};

export const config = {
  matcher: [
    '/login',
    '/register',
    '/verify-email',
    '/forgot-password',
    '/reset-password',
    '/cart',
    '/checkout',
    '/success',
    '/teach/:path*',
    '/application/status',
    '/my-courses',
    '/admin-dashboard/:path*',
    '/instructor-dashboard/:path*',
  ],
};
