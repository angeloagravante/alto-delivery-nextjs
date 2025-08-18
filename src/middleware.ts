import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Check if Clerk is properly configured
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured = clerkPublishableKey && clerkPublishableKey !== 'pk_test_demo_placeholder_for_build';

  // If Clerk is not configured, allow all requests to pass through (demo mode)
  if (!isClerkConfigured) {
    return;
  }

  // If Clerk is configured, protect the dashboard routes
  if (isProtectedRoute(req)) {
    const { userId } = await auth()
    if (!userId) {
      const url = new URL('/sign-in', req.url)
      return Response.redirect(url)
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}