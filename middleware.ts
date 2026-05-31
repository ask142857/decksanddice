import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/onboard(.*)',
  '/games',
  '/games/(.*)',
  '/leaderboard(.*)',
  '/api/games',
  '/api/games/(.*)',
  '/api/leaderboard',
  '/api/webhooks/(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()

  // Redirect signed-in users away from the landing page.
  if (userId && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isPublicRoute(request)) {
    await auth.protect()
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
