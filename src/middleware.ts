import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
])

const isApiRoute = createRouteMatcher([
  '/api(.*)',
])

// Check if Clerk is properly configured
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = clerkPublishableKey && clerkPublishableKey !== 'pk_test_demo_placeholder_for_build';

// Create the middleware function conditionally
export default isClerkConfigured 
  ? clerkMiddleware(async (auth, req) => {
      // Only protect dashboard routes, not API routes
      if (isProtectedRoute(req) && !isApiRoute(req)) {
        const { userId } = await auth()
        if (!userId) {
          const url = new URL('/sign-in', req.url)
          return NextResponse.redirect(url)
        }
      }
    })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  : function middleware(_req: NextRequest) {
      // Demo mode - allow all requests to pass through
      return NextResponse.next();
    };

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}