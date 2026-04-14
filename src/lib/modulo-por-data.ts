/** Metadados mínimos para escolher o módulo “do período” a partir de uma data. */
export type ModuloParaResolver = {
  id: string;
  numero: number;
  mesReferencia: number | null;
  anoReferencia: number | null;
  codigoPublico: string | null;
};

/**
 * Escolhe o módulo mais adequado para `dataRef`:
 * 1) mês/ano de referência iguais à data;
 * 2) último módulo cuja referência seja ≤ data;
 * 3) fallback: módulo com maior `numero`.
 */
export function resolverModuloParaData(
  modulos: ModuloParaResolver[],
  dataRef: Date,
): ModuloParaResolver | null {
  if (modulos.length === 0) return null;

  const y = dataRef.getFullYear();
  const mo = dataRef.getMonth() + 1;
  const refKey = y * 12 + mo;

  const comData = modulos.filter(
    (m) => m.mesReferencia != null && m.anoReferencia != null,
  ) as (ModuloParaResolver & {
    mesReferencia: number;
    anoReferencia: number;
  })[];

  if (comData.length > 0) {
    const exato = comData.find((m) => m.anoReferencia === y && m.mesReferencia === mo);
    if (exato) return exato;

    const candidatos = comData
      .map((m) => ({
        m,
        key: m.anoReferencia * 12 + m.mesReferencia,
      }))
      .filter((x) => x.key <= refKey)
      .sort((a, b) => b.key - a.key);
    if (candidatos[0]) return candidatos[0].m;
  }

  return [...modulos].sort((a, b) => b.numero - a.numero)[0] ?? null;
}

export function rotuloModuloCurto(m: ModuloParaResolver): string {
  return m.codigoPublico ?? `Módulo ${m.numero}`;
}
