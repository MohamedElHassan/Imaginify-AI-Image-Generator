// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/api/webhooks/stripe(.*)',
  '/api/webhooks/clerk(.*)',
  '/route(.*)',
  '/sign-in(.*)',         // allow Clerk’s sign-in page
  '/sign-up(.*)',         // allow Clerk’s sign-up page
  '/api/auth(.*)',        // allow Clerk’s auth API
  '/_next(.*)',           // allow Next.js internals
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    // protected routes
    await auth.protect();
  }
  // let public routes through
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
