import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt-utils";

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthRoute = pathname.startsWith("/auth");
  const isUserDashboard = pathname.startsWith("/dashboard/user");
  const isFranchiseDashboard = pathname.startsWith(
    "/dashboard/franchise-owner",
  );

  const token = (await cookies()).get("_gf_")?.value;

  /* ------------------ NO TOKEN ------------------ */
  if (!token) {
    if (pathname === "/" || isAuthRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/auth/user", req.url));
  }

  /* ------------------ VERIFY TOKEN ------------------ */
  const decoded = await verifyToken(token);
  if (!decoded) {
    const res = NextResponse.redirect(new URL("/auth/user", req.url));
    res.cookies.delete("token");
    return res;
  }

  const { role } = decoded;

  /* ------------------ BLOCK AUTH ROUTES ------------------ */
  if (isAuthRoute) {
    // Redirect logged-in users to their appropriate dashboard
    if (role === "FranchiseOwner") {
      return NextResponse.redirect(
        new URL("/dashboard/franchise-owner", req.url),
      );
    }
    if (role === "User") {
      return NextResponse.redirect(new URL("/dashboard/user", req.url));
    }
  }

  /* ------------------ ROLE BASED ACCESS ------------------ */
  // User trying to access franchise dashboard
  if (isFranchiseDashboard && role !== "FranchiseOwner") {
    return NextResponse.redirect(new URL("/dashboard/user", req.url));
  }

  // Franchise owner trying to access user dashboard
  if (isUserDashboard && role !== "User") {
    return NextResponse.redirect(
      new URL("/dashboard/franchise-owner", req.url),
    );
  }

  /* ------------------ DEFAULT DASHBOARD ------------------ */
  if (pathname === "/dashboard" || pathname === "/") {
    if (role === "FranchiseOwner") {
      return NextResponse.redirect(
        new URL("/dashboard/franchise-owner", req.url),
      );
    }
    if (role === "User") {
      return NextResponse.redirect(new URL("/dashboard/user", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
