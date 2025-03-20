import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // If the user is not logged in and trying to access a protected route
  if (!token && !request.nextUrl.pathname.startsWith("/auth")) {
    // Allow access to the home page (which will show the splash screen)
    if (request.nextUrl.pathname === "/") {
      return NextResponse.next()
    }

    // Redirect to the home page for all other protected routes
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\.png).*)"],
}

