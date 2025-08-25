// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Skip Next.js internals
//   if (
//     pathname.startsWith("/api") ||
//     pathname.startsWith("/_next") ||
//     pathname === "/favicon.ico"
//   ) {
//     return NextResponse.next();
//   }

//   let isLoggedIn = false;
//   try {
//     // ✅ Use the Next.js rewrite proxy
//     const res = await fetch(`${request.nextUrl.origin}/api/admin/check-session`, {
//       method: "GET",
//       headers: {
//         Cookie: request.headers.get("cookie") || "",
//       },
//       credentials: "include",
//     });
//     isLoggedIn = res.status === 200;
//   } catch (_) {
//     isLoggedIn = false;
//   }

//   // 1. Root route
//   if (pathname === "/") {
//     return NextResponse.redirect(
//       new URL(isLoggedIn ? "/dashboard/home" : "/login", request.url)
//     );
//   }

//   // 2. Protected dashboard routes
//   if (pathname.startsWith("/dashboard") && !isLoggedIn) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // 3. Prevent logged-in users from visiting login/signup
//   if (isLoggedIn && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
//     return NextResponse.redirect(new URL("/dashboard/home", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };
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

  let isAdminLoggedIn = false;
  let isEmployeeLoggedIn = false;

  // 🔹 Check Admin Session
  try {
    const res = await fetch(`${request.nextUrl.origin}/api/admin/check-session`, {
      method: "GET",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    });
    isAdminLoggedIn = res.status === 200;
  } catch {
    isAdminLoggedIn = false;
  }

  // 🔹 Check Employee Session
  try {
    const res = await fetch(`${request.nextUrl.origin}/api/employee/check-session`, {
      method: "GET",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    });
    isEmployeeLoggedIn = res.status === 200;
  } catch {
    isEmployeeLoggedIn = false;
  }

  // 🔹 Ensure exclusivity (Employee session takes priority over Admin)
  if (isEmployeeLoggedIn) {
    // Block admin routes & login page
    if (pathname.startsWith("/dashboard") || pathname === "/login" || pathname.startsWith("/signup")) {
      return NextResponse.redirect(new URL("/employeedashboard/home", request.url));
    }
  } else if (isAdminLoggedIn) {
    // Block employee routes & emplogin page
    if (pathname.startsWith("/employeedashboard") || pathname === "/emplogin") {
      return NextResponse.redirect(new URL("/dashboard/home", request.url));
    }
  }

  // 🔹 Root `/`
  if (pathname === "/") {
    if (isAdminLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard/home", request.url));
    }
    if (isEmployeeLoggedIn) {
      return NextResponse.redirect(new URL("/employeedashboard/home", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔹 Admin Dashboard Protection
  if (pathname.startsWith("/dashboard") && !isAdminLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔹 Employee Dashboard Protection
  if (pathname.startsWith("/employeedashboard") && !isEmployeeLoggedIn) {
    return NextResponse.redirect(new URL("/emplogin", request.url));
  }

  // 🔹 Prevent logged-in users from accessing login pages
  if (isAdminLoggedIn && (pathname === "/login" || pathname.startsWith("/signup"))) {
    return NextResponse.redirect(new URL("/dashboard/home", request.url));
  }
  if (isEmployeeLoggedIn && pathname === "/emplogin") {
    return NextResponse.redirect(new URL("/employeedashboard/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
