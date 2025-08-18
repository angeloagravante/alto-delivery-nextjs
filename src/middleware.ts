import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware(async () => {
  // Temporarily disabled for demo purposes
  // In production, uncomment the following lines for proper authentication
  /*
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
  */
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}