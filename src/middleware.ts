import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next.js internals
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  let isLoggedIn = false;
  try {
    // ✅ Use the Next.js rewrite proxy
    const res = await fetch(`${request.nextUrl.origin}/api/admin/check-session`, {
      method: "GET",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    });
    isLoggedIn = res.status === 200;
  } catch (_) {
    isLoggedIn = false;
  }

  // 1. Root route
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(isLoggedIn ? "/dashboard/home" : "/login", request.url)
    );
  }

  // 2. Protected dashboard routes
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Prevent logged-in users from visiting login/signup
  if (isLoggedIn && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
    return NextResponse.redirect(new URL("/dashboard/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
