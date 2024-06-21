// import { clerkMiddleware } from '@clerk/nextjs/server';

// // Make sure that the `/api/webhooks/(.*)` route is not protected here
// export default clerkMiddleware({
//   ignoredRoutes: ["/api/webhooks(.*)"],
// })

// export const config = {
//   matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
// };

// import { authMiddleware } from "@clerk/nextjs/server";

// export default authMiddleware({
//   ignoredRoutes: ["/api/webhooks(.*)"],
// });

// export const config = {
//   matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
// };



// import { clerkMiddleware } from '@clerk/nextjs/server';

// // Make sure that the `/api/webhooks/(.*)` route is not protected here
// export default clerkMiddleware();

// export const config = {
//   matcher: [
//     '/((?!.*\\..*|_next|api/webhooks).*)', // Exclude api/webhooks
//     '/',
//     '/(api|trpc)(.*)',
//   ],
// };


import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  ignoredRoutes: ["/api/webhooks(.*)"],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
