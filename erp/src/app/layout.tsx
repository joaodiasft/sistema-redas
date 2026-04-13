import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ERP — Curso de Redação",
  description: "Gestão de alunos, frequência, materiais e financeiro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
