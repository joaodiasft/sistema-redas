import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Serve a landing estática em `/` (public/index.html) sem conflitar com o App Router. */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.rewrite(new URL("/index.html", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
