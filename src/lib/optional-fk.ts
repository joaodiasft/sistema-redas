/** Remove strings vazias / inválidas antes de passar ao Prisma (evita erro de FK). */
export function optionalRelationId(id: string | null | undefined): string | undefined {
  if (id == null) return undefined;
  const t = String(id).trim();
  if (t.length < 10) return undefined;
  return t;
}
