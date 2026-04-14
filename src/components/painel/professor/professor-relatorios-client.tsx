"use client";

import { jsPDF } from "jspdf";
import { Download, FileText } from "lucide-react";

export type RelatorioProfessorPayload = {
  professor: { nome: string; codigoPublico: string; materia: string };
  mesRef: string;
  turmas: {
    cursoNome: string;
    cursoCodigo: string;
    turmaNome: string;
    turmaCodigo: string;
    diaSemana: string;
    horaInicio: string | null;
    horaFim: string | null;
    classe: string;
    alunosCount: number;
  }[];
  alunosPorTurma: { turmaLabel: string; alunos: { nome: string; codigo: string }[] }[];
  frequenciaPorTurma: {
    turmaLabel: string;
    linhas: { nome: string; codigo: string; presencas: number; faltas: number; pct: string }[];
  }[];
  aulasMes: {
    dataStr: string;
    curso: string;
    turma: string;
    codigoTurma: string;
    modulo: string;
    titulo: string;
  }[];
};

function addText(doc: jsPDF, text: string, x: number, y: number, maxW: number, lh: number) {
  const lines = doc.splitTextToSize(text, maxW);
  doc.text(lines, x, y);
  return y + lines.length * lh;
}

export function ProfessorRelatoriosClient({ data }: { data: RelatorioProfessorPayload }) {
  const margin = 18;
  const footer = (doc: jsPDF) => {
    const h = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(
      `Gerado em ${new Date().toLocaleString("pt-BR")} · Confidencial · Professor ${data.professor.codigoPublico}`,
      margin,
      h - 10,
    );
    doc.setTextColor(0);
  };

  function exportGeral() {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    doc.setFontSize(15);
    doc.text("Redacao Nota Mil - Relatorio geral (professor)", margin, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    let y = 32;
    y = addText(
      doc,
      `Professor: ${data.professor.nome} (${data.professor.codigoPublico}) · ${data.professor.materia}`,
      margin,
      y,
      180,
      5,
    );
    y += 4;
    y = addText(doc, `Referencia mes (calendario): ${data.mesRef}`, margin, y, 180, 5);
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Turmas vinculadas", margin, y);
    doc.setFont("helvetica", "normal");
    y += 5;
    for (const t of data.turmas) {
      y = addText(
        doc,
        `${t.cursoNome} (${t.cursoCodigo}) | ${t.turmaNome} (${t.turmaCodigo}) | ${t.diaSemana} ${t.horaInicio ?? ""}-${t.horaFim ?? ""} | Alunos: ${t.alunosCount}`,
        margin,
        y,
        180,
        5,
      );
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    }
    footer(doc);
    doc.save(`relatorio-geral-prof-${data.professor.codigoPublico}.pdf`);
  }

  function exportPorTurma() {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Relatorio por turma", margin, 20);
    doc.setFontSize(10);
    let y = 30;
    for (const t of data.turmas) {
      doc.setFont("helvetica", "bold");
      y = addText(doc, `${t.turmaCodigo} - ${t.turmaNome}`, margin, y, 180, 5);
      doc.setFont("helvetica", "normal");
      y += 1;
      y = addText(
        doc,
        `Curso: ${t.cursoNome} (${t.cursoCodigo}) | Classe: ${t.classe} | Alunos: ${t.alunosCount}`,
        margin,
        y,
        180,
        5,
      );
      y += 6;
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
    }
    footer(doc);
    doc.save(`relatorio-turmas-prof-${data.professor.codigoPublico}.pdf`);
  }

  function exportAlunos() {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Relatorio de alunos (minhas turmas)", margin, 20);
    doc.setFontSize(10);
    let y = 30;
    for (const bloco of data.alunosPorTurma) {
      doc.setFont("helvetica", "bold");
      y = addText(doc, bloco.turmaLabel, margin, y, 180, 5);
      doc.setFont("helvetica", "normal");
      y += 2;
      for (const a of bloco.alunos) {
        y = addText(doc, `${a.codigo} - ${a.nome}`, margin, y, 180, 5);
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
      }
      y += 4;
    }
    footer(doc);
    doc.save(`relatorio-alunos-prof-${data.professor.codigoPublico}.pdf`);
  }

  function exportFrequencia() {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Relatorio de frequencia (minhas turmas)", margin, 20);
    doc.setFontSize(10);
    let y = 30;
    for (const bloco of data.frequenciaPorTurma) {
      doc.setFont("helvetica", "bold");
      y = addText(doc, bloco.turmaLabel, margin, y, 180, 5);
      doc.setFont("helvetica", "normal");
      y += 2;
      for (const l of bloco.linhas) {
        y = addText(
          doc,
          `${l.codigo} ${l.nome} | Pres: ${l.presencas} Falta: ${l.faltas} | ${l.pct}`,
          margin,
          y,
          180,
          5,
        );
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
      }
      y += 4;
    }
    footer(doc);
    doc.save(`relatorio-frequencia-prof-${data.professor.codigoPublico}.pdf`);
  }

  function exportCalendario() {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Aulas do mes (${data.mesRef})`, margin, 20);
    doc.setFontSize(10);
    let y = 30;
    for (const a of data.aulasMes) {
      y = addText(
        doc,
        `${a.dataStr} | ${a.curso} ${a.turma} (${a.codigoTurma}) | ${a.modulo} | ${a.titulo}`,
        margin,
        y,
        180,
        5,
      );
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
    }
    footer(doc);
    doc.save(`relatorio-calendario-prof-${data.professor.codigoPublico}.pdf`);
  }

  const card =
    "flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between";

  return (
    <div className="space-y-4">
      <div className={card}>
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <FileText className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">Relatório geral</h2>
            <p className="mt-1 text-sm text-zinc-600">Turmas vinculadas e resumo.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={exportGeral}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Download className="h-4 w-4" aria-hidden />
          PDF
        </button>
      </div>

      <div className={card}>
        <div>
          <h2 className="font-semibold text-zinc-900">Por turma</h2>
          <p className="mt-1 text-sm text-zinc-600">Detalhe de cada turma sua.</p>
        </div>
        <button
          type="button"
          onClick={exportPorTurma}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
        >
          <Download className="h-4 w-4" aria-hidden />
          PDF
        </button>
      </div>

      <div className={card}>
        <div>
          <h2 className="font-semibold text-zinc-900">Alunos</h2>
          <p className="mt-1 text-sm text-zinc-600">Listas agrupadas por turma.</p>
        </div>
        <button
          type="button"
          onClick={exportAlunos}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
        >
          <Download className="h-4 w-4" aria-hidden />
          PDF
        </button>
      </div>

      <div className={card}>
        <div>
          <h2 className="font-semibold text-zinc-900">Frequência</h2>
          <p className="mt-1 text-sm text-zinc-600">Percentuais por aluno e turma.</p>
        </div>
        <button
          type="button"
          onClick={exportFrequencia}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
        >
          <Download className="h-4 w-4" aria-hidden />
          PDF
        </button>
      </div>

      <div className={card}>
        <div>
          <h2 className="font-semibold text-zinc-900">Calendário / aulas do mês</h2>
          <p className="mt-1 text-sm text-zinc-600">Aulas extras em {data.mesRef}.</p>
        </div>
        <button
          type="button"
          onClick={exportCalendario}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
        >
          <Download className="h-4 w-4" aria-hidden />
          PDF
        </button>
      </div>

      <p className="text-xs text-zinc-500">
        PDFs gerados localmente no navegador, apenas com dados das suas turmas.
      </p>
    </div>
  );
}
