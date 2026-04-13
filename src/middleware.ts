import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth";

/** Serve a landing estática em `/` (public/index.html) sem conflitar com o App Router. */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.rewrite(new URL("/index.html", request.url));
  }

  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("session")?.value;
    if (!token) {
      const login = new URL("/login", request.url);
      return NextResponse.redirect(login);
    }
    const session = await verifySessionToken(token);
    if (!session) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.set("session", "", { path: "/", maxAge: 0 });
      return res;
    }
    if (session.perfil !== "ADMIN") {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.set("session", "", { path: "/", maxAge: 0 });
      return res;
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
