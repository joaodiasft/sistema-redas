"use client";

import { jsPDF } from "jspdf";
import { Download, FileText } from "lucide-react";

export type RelatorioAlunoPayload = {
  aluno: {
    nomeCompleto: string;
    codigoPublico: string;
    emailContato: string;
    situacao: string;
    tipoPlano: string;
    diaPagamento: number | null;
  };
  matriculas: { curso: string; turma: string; codigoTurma: string }[];
  parcelas: {
    moduloNumero: number;
    status: string;
    valorBase: string | null;
    desconto: string | null;
    valorFinal: string | null;
    pagoEm: string | null;
  }[];
  presencas: {
    data: string;
    modulo: string;
    encontro: string;
    presente: boolean;
    reposicao: boolean;
  }[];
  entregas: { data: string; quantidade: number; viaSecretaria: boolean; observacao: string | null }[];
  showRedacao: boolean;
};

function addWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

export function AlunoRelatoriosClient({ data }: { data: RelatorioAlunoPayload }) {
  const margin = 18;
  let y = 20;

  function newDoc(title: string) {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    doc.setFontSize(16);
    doc.text("Redacao Nota Mil", margin, y);
    doc.setFontSize(11);
    doc.setTextColor(80);
    doc.text(title, margin, y + 7);
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    return { doc, startY: y + 16 };
  }

  function footer(doc: jsPDF, page = 1) {
    const h = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(
      `Gerado em ${new Date().toLocaleString("pt-BR")} · Uso exclusivo do aluno · Pag. ${page}`,
      margin,
      h - 10,
    );
    doc.setTextColor(0);
  }

  function exportGeral() {
    const { doc, startY } = newDoc("Relatorio geral do aluno");
    let py = startY;
    py = addWrappedText(
      doc,
      `Aluno: ${data.aluno.nomeCompleto} (${data.aluno.codigoPublico})`,
      margin,
      py,
      180,
      5,
    );
    py += 2;
    py = addWrappedText(doc, `E-mail: ${data.aluno.emailContato}`, margin, py, 180, 5);
    py += 2;
    py = addWrappedText(
      doc,
      `Situacao: ${data.aluno.situacao} · Plano: ${data.aluno.tipoPlano} · Vencimento (dia): ${data.aluno.diaPagamento ?? "-"}`,
      margin,
      py,
      180,
      5,
    );
    py += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Matriculas", margin, py);
    doc.setFont("helvetica", "normal");
    py += 5;
    for (const m of data.matriculas) {
      py = addWrappedText(
        doc,
        `- ${m.curso} | ${m.turma} (${m.codigoTurma})`,
        margin,
        py,
        180,
        5,
      );
    }
    py += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Resumo financeiro (modulos)", margin, py);
    doc.setFont("helvetica", "normal");
    py += 5;
    for (const p of data.parcelas) {
      py = addWrappedText(
        doc,
        `Modulo ${p.moduloNumero}: ${p.status} · Final: ${p.valorFinal ?? "-"}`,
        margin,
        py,
        180,
        5,
      );
    }
    py += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Frequencia (ultimos registros)", margin, py);
    doc.setFont("helvetica", "normal");
    py += 5;
    for (const pr of data.presencas.slice(0, 25)) {
      py = addWrappedText(
        doc,
        `${pr.data} | ${pr.modulo} | ${pr.encontro} | ${pr.presente ? "Presente" : "Falta"}`,
        margin,
        py,
        180,
        5,
      );
      if (py > 270) {
        doc.addPage();
        py = 20;
      }
    }
    if (data.showRedacao && data.entregas.length > 0) {
      py += 4;
      if (py > 240) {
        doc.addPage();
        py = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.text("Redacoes entregues", margin, py);
      doc.setFont("helvetica", "normal");
      py += 5;
      for (const e of data.entregas.slice(0, 20)) {
        py = addWrappedText(
          doc,
          `${e.data} · Qtd ${e.quantidade}${e.viaSecretaria ? " (secretaria)" : ""}`,
          margin,
          py,
          180,
          5,
        );
        if (py > 270) {
          doc.addPage();
          py = 20;
        }
      }
    }
    footer(doc);
    doc.save(`relatorio-geral-${data.aluno.codigoPublico}.pdf`);
  }

  function exportFinanceiro() {
    const { doc, startY } = newDoc("Relatorio financeiro");
    let py = startY;
    py = addWrappedText(doc, `${data.aluno.nomeCompleto} · ${data.aluno.codigoPublico}`, margin, py, 180, 5);
    py += 6;
    for (const p of data.parcelas) {
      const line = `Modulo ${p.moduloNumero} | ${p.status} | Base ${p.valorBase ?? "-"} | Desc. ${p.desconto ?? "-"} | Final ${p.valorFinal ?? "-"} | Pago em ${p.pagoEm ?? "-"}`;
      py = addWrappedText(doc, line, margin, py, 180, 5);
      if (py > 280) {
        doc.addPage();
        py = 20;
      }
    }
    footer(doc);
    doc.save(`relatorio-financeiro-${data.aluno.codigoPublico}.pdf`);
  }

  function exportFrequencia() {
    const { doc, startY } = newDoc("Relatorio de frequencia");
    let py = startY;
    py = addWrappedText(doc, `${data.aluno.nomeCompleto} · ${data.aluno.codigoPublico}`, margin, py, 180, 5);
    py += 6;
    for (const pr of data.presencas) {
      py = addWrappedText(
        doc,
        `${pr.data} | ${pr.modulo} | ${pr.encontro} | ${pr.presente ? "Presente" : "Falta"} | Rep. ${pr.reposicao ? "Sim" : "Nao"}`,
        margin,
        py,
        180,
        5,
      );
      if (py > 280) {
        doc.addPage();
        py = 20;
      }
    }
    footer(doc);
    doc.save(`relatorio-frequencia-${data.aluno.codigoPublico}.pdf`);
  }

  function exportRedacoes() {
    if (!data.showRedacao) return;
    const { doc, startY } = newDoc("Relatorio de redacoes");
    let py = startY;
    py = addWrappedText(doc, `${data.aluno.nomeCompleto} · ${data.aluno.codigoPublico}`, margin, py, 180, 5);
    py += 6;
    for (const e of data.entregas) {
      py = addWrappedText(
        doc,
        `${e.data} | Quantidade: ${e.quantidade} | ${e.viaSecretaria ? "Secretaria" : "Direta"}${e.observacao ? ` | Obs: ${e.observacao}` : ""}`,
        margin,
        py,
        180,
        5,
      );
      if (py > 280) {
        doc.addPage();
        py = 20;
      }
    }
    footer(doc);
    doc.save(`relatorio-redacoes-${data.aluno.codigoPublico}.pdf`);
  }

  const cardClass =
    "flex flex-col rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4";

  return (
    <div className="space-y-4">
      <div className={cardClass}>
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white">
            <FileText className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">Relatório geral</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Matrículas, resumo financeiro, frequência
              {data.showRedacao ? " e redações" : ""}.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={exportGeral}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#be123c] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#9f1239] sm:mt-0"
        >
          <Download className="h-4 w-4" aria-hidden />
          Baixar PDF
        </button>
      </div>

      <div className={cardClass}>
        <div>
          <h2 className="font-semibold text-zinc-900">Relatório financeiro</h2>
          <p className="mt-1 text-sm text-zinc-600">Parcelas por módulo e valores.</p>
        </div>
        <button
          type="button"
          onClick={exportFinanceiro}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50 sm:mt-0"
        >
          <Download className="h-4 w-4" aria-hidden />
          PDF
        </button>
      </div>

      <div className={cardClass}>
        <div>
          <h2 className="font-semibold text-zinc-900">Relatório de frequência</h2>
          <p className="mt-1 text-sm text-zinc-600">Datas, módulos e presenças.</p>
        </div>
        <button
          type="button"
          onClick={exportFrequencia}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50 sm:mt-0"
        >
          <Download className="h-4 w-4" aria-hidden />
          PDF
        </button>
      </div>

      {data.showRedacao ? (
        <div className={cardClass}>
          <div>
            <h2 className="font-semibold text-zinc-900">Relatório de redações</h2>
            <p className="mt-1 text-sm text-zinc-600">Histórico de entregas registradas.</p>
          </div>
          <button
            type="button"
            onClick={exportRedacoes}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50 sm:mt-0"
          >
            <Download className="h-4 w-4" aria-hidden />
            PDF
          </button>
        </div>
      ) : null}

      <p className="text-xs text-zinc-500">
        Os PDFs são gerados no seu aparelho a partir dos dados já carregados nesta página. Para
        impressão, use o visualizador de PDF do sistema.
      </p>
    </div>
  );
}
