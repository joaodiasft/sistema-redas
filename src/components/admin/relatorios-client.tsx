"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Loader2, RefreshCw } from "lucide-react";
import type { RelatorioPayload } from "@/lib/relatorio-data";
import { PanelCard } from "@/components/admin/panel-card";

type CursoOpt = { id: string; nome: string; codigo: string };
type TurmaOpt = { id: string; nome: string; codigo: string; cursoId: string };
type AlunoOpt = { id: string; nome: string; codigoPublico: string };

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#e11d74]/40 focus:ring-2 focus:ring-[#e11d74]/15";

export function RelatoriosClient({
  cursos,
  turmas,
  alunos,
}: {
  cursos: CursoOpt[];
  turmas: TurmaOpt[];
  alunos: AlunoOpt[];
}) {
  const [tipo, setTipo] = useState<RelatorioPayload["tipo"]>("geral");
  const [cursoId, setCursoId] = useState("");
  const [turmaId, setTurmaId] = useState("");
  const [alunoId, setAlunoId] = useState("");
  const [situacao, setSituacao] = useState<string>("TODOS");
  const [data, setData] = useState<RelatorioPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRelatorio = useCallback(async () => {
    setLoading(true);
    setError(null);
    const p = new URLSearchParams();
    p.set("tipo", tipo);
    if (cursoId) p.set("cursoId", cursoId);
    if (turmaId) p.set("turmaId", turmaId);
    if (alunoId) p.set("alunoId", alunoId);
    p.set("situacao", situacao);
    try {
      const r = await fetch(`/api/admin/relatorio?${p.toString()}`, { cache: "no-store" });
      if (!r.ok) {
        const j = (await r.json()) as { error?: string };
        throw new Error(j.error ?? "Erro ao gerar");
      }
      setData((await r.json()) as RelatorioPayload);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [tipo, cursoId, turmaId, alunoId, situacao]);

  useEffect(() => {
    void fetchRelatorio();
  }, [fetchRelatorio]);

  async function exportPdf() {
    if (!data) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 48;
    let y = margin;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Relatório — Redação Nota Mil", margin, y);
    y += 28;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date(data.geradoEm).toLocaleString("pt-BR")}`, margin, y);
    y += 18;
    doc.text(`Tipo: ${data.tipo}`, margin, y);
    y += 22;

    doc.setFont("helvetica", "bold");
    doc.text("Resumo", margin, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    const r = data.resumo;
    const lines = [
      `Alunos (filtro): ${r.totalAlunos}`,
      `Ativos / Inativos / Devendo: ${r.ativos} / ${r.inativos} / ${r.devendo}`,
      `Turmas ativas (sistema): ${r.turmas} · Cursos: ${r.cursos} · Professores: ${r.professores}`,
      `Parcelas pendentes: ${r.parcelasPendentes} · Atrasadas: ${r.parcelasAtrasadas}`,
      `Redações (total sistema): ${r.redacoes}`,
    ];
    for (const line of lines) {
      doc.text(line, margin, y);
      y += 14;
    }
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text("Lista de alunos", margin, y);
    y += 16;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    for (const a of data.alunos) {
      const row = `${a.codigo} · ${a.nome} · ${a.situacao} · ${a.cursos}`;
      const split = doc.splitTextToSize(row, 500);
      for (const line of split) {
        if (y > 740) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 12;
      }
      y += 4;
    }

    doc.save(`relatorio-${data.tipo}-${Date.now()}.pdf`);
  }

  const turmasFiltradas = cursoId ? turmas.filter((t) => t.cursoId === cursoId) : turmas;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <PanelCard>
        <h2 className="text-sm font-semibold text-zinc-900">Filtros dinâmicos</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Atualização em tempo real ao alterar campos. Escolha o tipo e refine por curso, turma ou
          aluno.
        </p>
        <div className="mt-4 space-y-3">
          <label className="block text-xs font-semibold text-zinc-600">Tipo</label>
          <select
            className={inputClass}
            value={tipo}
            onChange={(e) => setTipo(e.target.value as RelatorioPayload["tipo"])}
          >
            <option value="geral">Geral</option>
            <option value="curso">Por curso (use filtro curso)</option>
            <option value="turma">Por turma (use filtro turma)</option>
            <option value="aluno">Por aluno</option>
          </select>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-600">Curso</label>
              <select className={`${inputClass} mt-1`} value={cursoId} onChange={(e) => setCursoId(e.target.value)}>
                <option value="">Todos</option>
                {cursos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-600">Turma</label>
              <select className={`${inputClass} mt-1`} value={turmaId} onChange={(e) => setTurmaId(e.target.value)}>
                <option value="">Todas</option>
                {turmasFiltradas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.codigo} — {t.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-600">Aluno (tipo &quot;por aluno&quot;)</label>
            <select className={`${inputClass} mt-1`} value={alunoId} onChange={(e) => setAlunoId(e.target.value)}>
              <option value="">—</option>
              {alunos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.codigoPublico} — {a.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-600">Situação</label>
            <select className={`${inputClass} mt-1`} value={situacao} onChange={(e) => setSituacao(e.target.value)}>
              <option value="TODOS">Todas</option>
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
              <option value="DEVENDO">Devendo</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void fetchRelatorio()}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Atualizar
            </button>
            <button
              type="button"
              onClick={() => void exportPdf()}
              disabled={!data}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Exportar PDF
            </button>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
      </PanelCard>

      <PanelCard>
        <h2 className="text-sm font-semibold text-zinc-900">Pré-visualização</h2>
        {loading && !data ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
          </p>
        ) : data ? (
          <div className="mt-4 space-y-4 text-sm">
            <div className="rounded-xl bg-zinc-50 p-3 text-xs text-zinc-700">
              <p>
                <strong>Resumo:</strong> {data.resumo.totalAlunos} aluno(s) no filtro · ativos{" "}
                {data.resumo.ativos} · inativos {data.resumo.inativos} · devendo {data.resumo.devendo}
              </p>
              <p className="mt-1">
                Sistema: {data.resumo.turmas} turmas · {data.resumo.cursos} cursos · parcelas pendentes{" "}
                {data.resumo.parcelasPendentes}
              </p>
            </div>
            <div className="max-h-[420px] overflow-auto rounded-xl border border-zinc-100">
              <table className="w-full min-w-[480px] text-left text-xs">
                <thead className="sticky top-0 bg-zinc-100/95 text-[0.65rem] font-semibold uppercase tracking-wide text-zinc-600">
                  <tr>
                    <th className="px-3 py-2">Código</th>
                    <th className="px-3 py-2">Nome</th>
                    <th className="px-3 py-2">Situação</th>
                    <th className="px-3 py-2">Turmas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {data.alunos.map((a) => (
                    <tr key={a.codigo} className="hover:bg-zinc-50/80">
                      <td className="px-3 py-2 font-mono">{a.codigo}</td>
                      <td className="px-3 py-2">{a.nome}</td>
                      <td className="px-3 py-2">{a.situacao}</td>
                      <td className="px-3 py-2 text-zinc-600">{a.turmas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-zinc-500">Sem dados.</p>
        )}
      </PanelCard>
    </div>
  );
}
