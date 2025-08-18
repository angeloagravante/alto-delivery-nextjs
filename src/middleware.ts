import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function middleware(_request: NextRequest) {
  // Check if Clerk is properly configured
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured = clerkPublishableKey && clerkPublishableKey !== 'pk_test_demo_placeholder_for_build';

  // If Clerk is not configured, allow all requests to pass through
  if (!isClerkConfigured) {
    return NextResponse.next();
  }

  // If Clerk is configured, we would normally handle authentication here
  // For now, in demo mode, we still allow all requests to pass through
  // In production, this is where you would uncomment the Clerk authentication logic
  
  /*
  // When ready to enable authentication, replace the above logic with:
  import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
  
  return clerkMiddleware(async (auth, req) => {
    const isProtectedRoute = createRouteMatcher([
      '/dashboard(.*)',
    ])
    
    if (isProtectedRoute(req)) {
      const { userId } = await auth()
      if (!userId) {
        const url = new URL('/sign-in', req.url)
        return NextResponse.redirect(url)
      }
    }
  })(request, event);
  */
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}