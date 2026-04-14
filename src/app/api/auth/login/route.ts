import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { signSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const COOKIE = "session";
const MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  try {
    const emailRaw =
      typeof body === "object" && body !== null && "email" in body
        ? String((body as { email: unknown }).email ?? "")
        : "";
    const senha =
      typeof body === "object" && body !== null && "senha" in body
        ? String((body as { senha: unknown }).senha ?? "")
        : "";

    const email = emailRaw.trim().toLowerCase();
    if (!email || !senha) {
      return NextResponse.json(
        { error: "Informe e-mail e senha." },
        { status: 400 },
      );
    }

    const user = await prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        senhaHash: true,
        perfil: true,
        ativo: true,
      },
    });

    if (!user?.ativo) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos." },
        { status: 401 },
      );
    }

    const match = await bcrypt.compare(senha, user.senhaHash);
    if (!match) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos." },
        { status: 401 },
      );
    }

    const token = await signSession(user.id, user.email, user.perfil);
    const res = NextResponse.json({
      ok: true,
      perfil: user.perfil,
    });
    res.cookies.set(COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: MAX_AGE,
    });
    return res;
  } catch (e) {
    console.error("[login]", e);
    const msg = e instanceof Error ? e.message : "Erro ao processar login.";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? msg
            : "Erro no servidor. Verifique a base de dados e variáveis (DATABASE_URL, AUTH_SECRET).",
      },
      { status: 500 },
    );
  }
}
