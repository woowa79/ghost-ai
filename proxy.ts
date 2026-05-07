import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

function normalizePath(value: string | undefined, fallback: string) {
  const raw = (value || fallback).trim()
  const path = raw.startsWith("/") ? raw : `/${raw}`
  return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path
}

const signInPath = normalizePath(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL, "/sign-in")
const signUpPath = normalizePath(process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL, "/sign-up")

const isPublicRoute = createRouteMatcher([
  `${signInPath}(.*)`,
  `${signUpPath}(.*)`,
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
