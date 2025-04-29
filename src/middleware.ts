import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/profile"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth")?.value;
  const path = request.nextUrl.pathname;

  const isProtectedPath = protectedPaths.some((pp) => path.startsWith(pp));

  if (isProtectedPath && !token && path !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|login).*)"],
};
