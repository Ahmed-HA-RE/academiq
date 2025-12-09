import { NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/auth';
import { headers } from 'next/headers';

export const proxy = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname;

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
};

export const config = {
  matcher: [
    '/login',
    '/register',
    '/verify-email',
    '/forgot-password',
    '/reset-password',
  ],
};
