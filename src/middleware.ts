import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminToken = request.cookies.get('admin_token')?.value;
  const isAuthenticated = adminToken === 'authenticated';

  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminLoginRoute = pathname === '/admin/login';
  const isOldLoginRoute = pathname === '/login';
  const isDashboardRoute = pathname === '/dashboard';

  // Protect Admin Dashboard
  if (isAdminRoute && !isAdminLoginRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Redirect from login if already authenticated as admin
  if (isAdminLoginRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Redirect old user login/dashboard to track order
  if (isOldLoginRoute || isDashboardRoute) {
    return NextResponse.redirect(new URL('/track', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
