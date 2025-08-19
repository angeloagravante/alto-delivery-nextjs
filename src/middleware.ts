import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

// Check if Clerk is properly configured
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
const isClerkConfigured =
  clerkPublishableKey && clerkPublishableKey !== 'pk_test_demo_placeholder_for_build'

// Public (unprotected) routes. Everything else requires auth().protect().
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  // Health checks and webhooks should remain public
  '/api/db/health(.*)',
  '/api/webhooks(.*)',
])

// Create the middleware function conditionally
export default isClerkConfigured
  ? clerkMiddleware(async (auth, req) => {
      // Only protect non-public routes (includes API routes that aren't explicitly public)
      if (!isPublicRoute(req)) {
        // Establish Clerk context and protect the route
        await auth.protect()
      }
      // Do not return a response here; letting Next continue is fine
    })
  : function middleware(_req: NextRequest) {
      // Demo mode - allow all requests to pass through
      return NextResponse.next()
    }

export const config = {
  matcher: [
    // Run middleware on all paths except static files and Next internals
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    // Always run for API routes to establish Clerk context
    '/(api|trpc)(.*)',
  ],
}