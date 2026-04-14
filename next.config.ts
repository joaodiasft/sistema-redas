import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/dashboard/frequencia",
        destination: "/dashboard/operacional/presenca",
        permanent: false,
      },
      {
        source: "/dashboard/financeiro",
        destination: "/dashboard/operacional/financeiro",
        permanent: false,
      },
      {
        source: "/dashboard/materiais",
        destination: "/dashboard/modulos",
        permanent: false,
      },
      {
        source: "/dashboard/semestre-modulos",
        destination: "/dashboard/modulos",
        permanent: false,
      },
      {
        source: "/dashboard/usuarios",
        destination: "/dashboard/alunos",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
