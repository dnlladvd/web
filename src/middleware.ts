import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Check for session cookie
  const sessionId = request.cookies.get("session_id")?.value;
  const isAuthenticated = !!sessionId;

  // If the user is not signed in and the route is protected, redirect to login
  if (!isAuthenticated) {
    // Check if the route is not an auth route
    if (
      !request.nextUrl.pathname.startsWith("/auth/") &&
      !request.nextUrl.pathname.startsWith("/_next/") &&
      !request.nextUrl.pathname.startsWith("/api/") &&
      !request.nextUrl.pathname.includes(".")
    ) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  } else {
    // If user is signed in and trying to access auth pages, redirect to dashboard
    if (request.nextUrl.pathname.startsWith("/auth/")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
