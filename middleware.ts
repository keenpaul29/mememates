import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that don't require authentication
const publicPaths = ['/', '/login', '/signup', '/api/auth'];

// Paths that new users should be redirected to onboarding from
const protectedNewUserPaths = ['/discover', '/matches', '/profile'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check authentication
  const token = await getToken({ req: request });

  // If not authenticated, redirect to login
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // If new user trying to access protected paths, redirect to onboarding
  if (token.isNewUser && protectedNewUserPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  // If completed onboarding user tries to access onboarding, redirect to discover
  if (!token.isNewUser && pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/discover', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. Matches any path starting with:
     *  - api/auth (auth endpoints)
     *  - _next/static (static files)
     *  - _next/image (image optimization files)
     *  - favicon.ico (favicon file)
     *  - images/ (public images)
     * 2. Matches root path exactly
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
