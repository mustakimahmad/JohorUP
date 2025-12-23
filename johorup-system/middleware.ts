import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/auth/error',
    '/auth/pending-approval',
    '/maintenance'
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
  
  // For protected routes, let NextAuth handle authentication
  // This middleware will just handle basic routing
  return NextResponse.next()
}

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