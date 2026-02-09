import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protected routes that require authentication
  const protectedRoutes = ["/home", "/admin"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected) {
    const accessToken = request.cookies.get("access_token")?.value;

    // If no access token, redirect to sign-in
    if (!accessToken) {
      const signInUrl = new URL("/auth/sign-in", request.url);
      signInUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Optional: Verify token expiry here
    // This is a simple check, you might want to decode JWT and check exp
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Specify which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
