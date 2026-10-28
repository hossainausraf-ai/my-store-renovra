import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginRoute = request.nextUrl.pathname === '/admin/login'
  const isUserLoginRoute = request.nextUrl.pathname === '/login'
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')
  
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@renovra.com'
  const isAdmin = user?.email === adminEmail

  // Admin route protection
  if (isAdminRoute && !isLoginRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    if (!isAdmin) {
      // Normal user trying to access admin
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Admin Login page redirect if already logged in as admin
  if (isLoginRoute && user && isAdmin) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // User Dashboard protection
  if (isDashboardRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // User Login page redirect if already logged in
  if (isUserLoginRoute && user) {
    return NextResponse.redirect(new URL(isAdmin ? '/admin' : '/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
