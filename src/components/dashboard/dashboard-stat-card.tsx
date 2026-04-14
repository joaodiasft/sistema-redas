import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: number | string;
  hint: string;
  Icon: LucideIcon;
  accent: string;
  trend?: { dir: "up" | "down" | "flat"; label: string };
};

export function DashboardStatCard({ label, value, hint, Icon, accent, trend }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-100/80 bg-white p-4 shadow-sm ring-1 ring-zinc-100/60 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-[0.12] blur-2xl ${accent}`}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-zinc-900">
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-50 text-zinc-700 shadow-inner ring-1 ring-zinc-100 transition group-hover:scale-[1.03] ${accent}`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <p className="text-xs text-zinc-400">{hint}</p>
        {trend ? (
          <span
            className={`inline-flex items-center gap-0.5 text-[0.7rem] font-semibold tabular-nums ${
              trend.dir === "up"
                ? "text-emerald-600"
                : trend.dir === "down"
                  ? "text-rose-600"
                  : "text-zinc-400"
            }`}
          >
            {trend.dir === "up" ? "↑" : trend.dir === "down" ? "↓" : "→"} {trend.label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
