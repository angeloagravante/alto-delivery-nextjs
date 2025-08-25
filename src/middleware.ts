import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Check if Clerk is properly configured
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
const isClerkConfigured =
  clerkPublishableKey && clerkPublishableKey !== 'pk_test_demo_placeholder_for_build'

// Public (unprotected) routes. Everything else requires auth().protect().
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/customer(.*)',
  '/onboarding/role',
  // Health checks and webhooks should remain public
  '/api/db/health(.*)',
  '/api/webhooks(.*)',
])

// Create the middleware function conditionally
export default isClerkConfigured
  ? clerkMiddleware(async (auth, req) => {
      // Always establish Clerk context for API routes to ensure auth() works
      if (req.nextUrl.pathname.startsWith('/api/')) {
        try {
          // Establish Clerk context without protecting (let individual routes handle auth)
          await auth()
        } catch (error) {
          console.log('Clerk context establishment failed:', error)
          // Continue anyway - individual API routes will handle auth
        }
        return NextResponse.next()
      }
      
      // Redirect store owners away from customer section
      if (req.nextUrl.pathname.startsWith('/customer')) {
        try {
          const { userId } = await auth()
          if (userId) {
            // We can't access Prisma in middleware, so rely on a lightweight heuristic:
            // route stays public; server-side layout will enforce with Prisma lookup.
            // Here we simply pass through.
          }
        } catch {}
      }

      // Only protect non-public routes (excludes API routes)
      if (!isPublicRoute(req)) {
        // Establish Clerk context and protect the route
        await auth.protect()
      }
      // Do not return a response here; letting Next continue is fine
    })
  : function middleware() {
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