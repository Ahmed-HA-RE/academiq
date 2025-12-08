import { NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/auth';
import { headers } from 'next/headers';

export const proxy = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname === '/register' && session) {
    return NextResponse.redirect(new URL('/', req.url));
  }
};

export const config = {
  matcher: ['/login', '/register'],
};
