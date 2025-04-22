// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

//
// 1) Define public routes (no auth required):
//
const isPublicRoute = createRouteMatcher([
  '/api/webhooks/stripe(.*)',  // Stripe webhook receiver remains public
  '/api/webhooks/clerk(.*)',   // Clerk webhook receiver remains public
  '/route(.*)',                // Your custom /route endpoint
]);

//
// 2) Apply middleware: protect everything _except_ public routes
//
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    // Only enforce authentication on non-public paths
    await auth.protect();
  }
});

//
// 3) Tell Next.js which paths this middleware should run on.
//    Here: all non-static, non‑_next pages + API/TRPC routes.
//
export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
