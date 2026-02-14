import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt-utils";

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Public routes that don't require authentication
  const isPublic = pathname === "/";

  // ✅ Auth routes (login, register, etc.)
  const isAuthRoute = pathname.startsWith("/auth");

  const token = (await cookies()).get("_gf_")?.value;

  // Handle unauthenticated users
  if (!token) {
    if (isPublic || isAuthRoute) {
      return NextResponse.next();
    }
    // ⛔ No token and protected route → redirect to login
    return NextResponse.redirect(new URL("/auth/user", req.url));
  }

  // Verify token for authenticated users
  const result = await verifyToken(token);
  if (!result) {
    // ⛔ Invalid or expired token → force login
    const response = NextResponse.redirect(new URL("/auth/user", req.url));
    // Clear the invalid token
    response.cookies.delete("_gf_");
    return response;
  }

  const { role } = result;

  // ✅ Prevent authenticated users from accessing auth pages
  if (isAuthRoute) {
    // Redirect to appropriate dashboard based on role
    if (role === "User") {
      return NextResponse.redirect(new URL("/dashboard/user", req.url));
    }
    if (role === "FranchiseOwner") {
      return NextResponse.redirect(new URL("/dashboard/franchise", req.url));
    }
  }

  // 🔒 Prevent authenticated users from accessing root route
  if (isPublic) {
    // Redirect authenticated users to their dashboard
    if (role === "User") {
      return NextResponse.redirect(new URL("/dashboard/user", req.url));
    }
    if (role === "FranchiseOwner") {
      return NextResponse.redirect(new URL("/dashboard/franchise", req.url));
    }
  }

  // 🔒 Role-based access control for dashboard routes
  if (pathname.startsWith("/dashboard/user")) {
    if (role !== "User") {
      // ⛔ Seller trying to access buyer dashboard
      return NextResponse.redirect(
        new URL("/dashboard/franchise-owner", req.url),
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard/franchise-owner")) {
    if (role !== "FranchiseOwner") {
      // ⛔ Buyer trying to access seller dashboard
      return NextResponse.redirect(new URL("/dashboard/user", req.url));
    }
    return NextResponse.next();
  }

  // ✅ Root dashboard redirect based on role
  if (pathname === "/dashboard") {
    if (role === "User") {
      return NextResponse.redirect(new URL("/dashboard/user", req.url));
    }
    if (role === "FranchiseOwner") {
      return NextResponse.redirect(new URL("/dashboard/franchise", req.url));
    }
  }

  // ❌ Unknown route or role → redirect to appropriate dashboard
  if (role === "User") {
    return NextResponse.redirect(new URL("/dashboard/user", req.url));
  }
  if (role === "FranchiseOwner") {
    return NextResponse.redirect(
      new URL("/dashboard/franchise-owner", req.url),
    );
  }

  // ❌ Fallback
  return NextResponse.redirect(new URL("/auth/user", req.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
