import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Entrar — Redação Nota Mil",
  description: "Acesse sua conta na plataforma Redação Nota Mil",
};

export default function LoginPage() {
  return <LoginForm />;
}
