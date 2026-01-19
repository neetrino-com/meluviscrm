import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default auth((req) => {
  const session = req.auth;
  const path = req.nextUrl.pathname;

  // Allow access to login page
  if (path === '/login') {
    if (session) {
      return NextResponse.redirect(new URL('/apartments', req.url));
    }
    return NextResponse.next();
  }

  // Require authentication for all other pages
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Admin routes protection
  if (path.startsWith('/admin') && session.user.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/apartments', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
