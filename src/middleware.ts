import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth";

/** Apenas ADMIN acede ao ERP em `/dashboard`. Professores e alunos usam `/painel/*`. */
const PAINEL_ADMIN = "ADMIN" as const;

/** Serve a landing estática em `/` (public/index.html) sem conflitar com o App Router. */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.rewrite(new URL("/index.html", request.url));
  }

  const token = request.cookies.get("session")?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (pathname.startsWith("/dashboard")) {
    if (!token || !session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (session.perfil === "ALUNO") {
      return NextResponse.redirect(new URL("/painel/aluno", request.url));
    }
    if (session.perfil === "PROFESSOR") {
      return NextResponse.redirect(new URL("/painel/professor", request.url));
    }
    if (session.perfil !== PAINEL_ADMIN) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.set("session", "", { path: "/", maxAge: 0 });
      return res;
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/painel/aluno")) {
    if (!token || !session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (session.perfil !== "ALUNO") {
      if (session.perfil === PAINEL_ADMIN) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      if (session.perfil === "PROFESSOR") {
        return NextResponse.redirect(new URL("/painel/professor", request.url));
      }
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.set("session", "", { path: "/", maxAge: 0 });
      return res;
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/painel/professor")) {
    if (!token || !session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (session.perfil !== "PROFESSOR") {
      if (session.perfil === PAINEL_ADMIN) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      if (session.perfil === "ALUNO") {
        return NextResponse.redirect(new URL("/painel/aluno", request.url));
      }
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.set("session", "", { path: "/", maxAge: 0 });
      return res;
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/painel/:path*"],
};
