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
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
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
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #f4f4f5",
              fontSize: "13px",
            }}
          />
          <Bar dataKey="valor" fill="url(#barGrad)" radius={[6, 6, 0, 0]} maxBarSize={48} />
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e11d74" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
