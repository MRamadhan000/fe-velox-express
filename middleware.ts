import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Ambil token dari cookies atau headers
  const token = request.cookies.get('auth_token')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '');

  // Jika route dimulai dengan /admin dan tidak ada token, redirect ke admin login
  if (request.nextUrl.pathname.startsWith('/admin') && !token) {
    return NextResponse.redirect(new URL('/auth/admin/login', request.url));
  }

  // Jika route dimulai dengan /dashboard dan tidak ada token, redirect ke login
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Jika route adalah /packet atau /shipments dan tidak ada token, redirect ke login
  if ((request.nextUrl.pathname === '/packet' || request.nextUrl.pathname === '/shipments') && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Jika route adalah /auth/login atau /auth/register dan sudah ada token, redirect ke dashboard
  if ((request.nextUrl.pathname === '/auth/login' || request.nextUrl.pathname === '/auth/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Jika route adalah /auth/admin/login dan sudah ada token, redirect ke admin dashboard
  if (request.nextUrl.pathname === '/auth/admin/login' && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};