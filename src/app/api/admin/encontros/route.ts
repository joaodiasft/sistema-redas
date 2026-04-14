import { requireAdminSession } from "@/lib/api-admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.res;

  const sem = await prisma.semestre.findFirst({
    where: { ativo: true },
    include: {
      modulos: {
        orderBy: { numero: "asc" },
        include: {
          encontros: { orderBy: { ordem: "asc" } },
        },
      },
    },
  });

  const encontros =
    sem?.modulos.flatMap((m) =>
      m.encontros.map((e) => ({
        id: e.id,
        rotulo: e.rotulo,
        ordem: e.ordem,
        moduloNumero: m.numero,
        moduloTitulo: m.titulo,
        codigoModulo: m.codigoPublico,
      })),
    ) ?? [];

  return Response.json({ encontros });
}
