"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardStats } from "@/lib/dashboard-stats";

export function StatsBarChart({ stats }: { stats: DashboardStats }) {
  const data = [
    { nome: "Alunos", valor: stats.totalAlunos },
    { nome: "Turmas", valor: stats.totalTurmas },
    { nome: "Cursos", valor: stats.totalCursos },
    { nome: "Professores", valor: stats.totalProfessores },
    { nome: "Módulos", valor: stats.totalModulos },
  ];

  return (
    <div className="w-full">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 12, left: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
            <XAxis
              dataKey="nome"
              tick={{ fontSize: 11, fill: "#71717a" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#71717a" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(225, 29, 116, 0.06)" }}
              formatter={(value) => [`${value ?? 0} registros`, "Quantidade"]}
              labelFormatter={(label) => String(label)}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #f4f4f5",
                fontSize: "13px",
              }}
            />
            <Bar
              name="Cadastros"
              dataKey="valor"
              fill="url(#barGrad)"
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            />
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e11d74" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center justify-center gap-2 text-[0.7rem] text-zinc-500">
        <span className="inline-flex h-2.5 w-6 rounded-sm bg-gradient-to-r from-[#e11d74] to-[#f472b6]" />
        <span>Barras = total cadastrado no sistema (cada categoria na legenda do eixo X)</span>
      </div>
      <p className="mt-3 text-center text-xs leading-relaxed text-zinc-500">
        Dados agregados em tempo real do banco. Eixo: volumes principais para comparar escala entre
        áreas (mês atual no calendário como referência visual).
      </p>
    </div>
  );
}
