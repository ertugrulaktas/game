import { ReactNode } from "react";

export function MetricCard({ title, value, subtitle, icon }: { title: string; value: ReactNode; subtitle?: string; icon?: ReactNode }) {
  return (
    <div className="metric-card">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="text-accent">{icon}</div>
      </div>
      <div className="mt-3 text-2xl font-bold text-ink">{value}</div>
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
}
