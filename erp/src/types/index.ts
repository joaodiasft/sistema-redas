/** Contratos compartilhados entre UI e camada de serviço (evoluem com o ERP) */

export type ModuloFichaNumero = 2 | 3 | 4 | 5;

export type EncontroOrdem = 1 | 2 | 3 | 4;

export interface ResumoDashboard {
  totalAlunos: number;
  turmasAtivas: number;
  faltasSemana: number;
  parcelasPendentes: number;
}
