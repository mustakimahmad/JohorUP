import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/auth/error',
    '/auth/pending-approval'
  ]
  
  // API routes that don't require authentication
  const publicApiRoutes = [
    '/api/auth',
    '/api/health'
  ]
  
  // Check if it's a public route
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }
  
  // Check if it's a public API route
  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }
  
  // Check if it's a static file
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/favicon') || 
      pathname.includes('.')) {
    return NextResponse.next()
  }
  
  // Protected routes - require authentication
  if (pathname.startsWith('/dashboard')) {
    if (!req.auth) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // Role-based access control
    const userRole = (req.auth.user as any)?.role
    
    // Admin routes - only for admin roles
    if (pathname.startsWith('/dashboard/admin')) {
      const adminRoles = ['sektor_perancangan', 'sektor_pembelajaran']
      if (!adminRoles.includes(userRole)) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }
    
    // School routes - only for school role
    if (pathname.startsWith('/dashboard/school')) {
      if (userRole !== 'school') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }
    
    // PPD routes - only for PPD role
    if (pathname.startsWith('/dashboard/ppd')) {
      if (userRole !== 'ppd') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }
    
    // Yayasan routes - only for Yayasan JCorp role
    if (pathname.startsWith('/dashboard/yayasan')) {
      if (userRole !== 'yayasan_jcorp') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }
    
    // Maintenance control - only for coordinators
    if (pathname.startsWith('/dashboard/maintenance-control')) {
      const coordinatorRoles = ['sektor_perancangan']
      if (!coordinatorRoles.includes(userRole)) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}