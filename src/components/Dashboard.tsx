"use client";

import { BarChart3, Boxes, Cloud, Database, Gauge, PackageCheck } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { kg, m3, pct, volumeM3 } from "@/lib/utils";
import { useLoadOptimaStore } from "@/store/useLoadOptimaStore";
import { MetricCard } from "@/components/MetricCard";

export function Dashboard() {
  const { scenario, savedScenarios, loadDemo, setScenarioName } = useLoadOptimaStore();
  const best = scenario.plans[0];
  const totalWeight = scenario.cargoItems.reduce((s, i) => s + i.weightKg * i.quantity, 0);
  const totalVolume = scenario.cargoItems.reduce((s, i) => s + volumeM3(i.lengthCm, i.widthCm, i.heightCm) * i.quantity, 0);
  const chart = scenario.plans.map((p) => ({ name: p.strategy.replace("-", " "), volume: Math.round(p.metrics.volumeUtilization * 100), payload: Math.round(p.metrics.payloadUtilization * 100), score: p.score }));
  return (
    <section id="dashboard" className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">LoadOptima AI</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">Akıllı Yükleme Optimizasyon Platformu</h1><p className="mt-2 max-w-3xl text-slate-600">AI-supported loading optimization, 3D truck/container simulation, inefficiency detection, scenario comparison, and carbon footprint planning for B2B logistics teams.</p></div>
          <div className="flex flex-wrap gap-2"><button className="btn-secondary" onClick={() => loadDemo("mixed")}>Load mixed box demo</button><button className="btn-primary" onClick={() => loadDemo("fertilizer")}>Load fertilizer demo</button></div>
        </div>
        <div className="mt-5 max-w-xl"><label className="text-sm font-medium text-slate-700">Scenario name<input className="input mt-1" value={scenario.scenarioName} onChange={(e) => setScenarioName(e.target.value)} /></label></div>
      </div>
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard title="Total scenarios" value={savedScenarios.length} subtitle="local saved/demo scenarios" icon={<Database />} />
        <MetricCard title="Avg vehicle utilization" value={best ? pct(best.metrics.volumeUtilization) : "—"} subtitle={best?.metrics.constraintMode ?? "run optimization"} icon={<Gauge />} />
        <MetricCard title="Avg payload utilization" value={best ? pct(best.metrics.payloadUtilization) : "—"} subtitle={kg(totalWeight)} icon={<PackageCheck />} />
        <MetricCard title="Total cargo cube" value={m3(totalVolume)} subtitle={`${scenario.cargoItems.length} cargo rows`} icon={<Boxes />} />
        <MetricCard title="Estimated CO₂e" value={scenario.carbon ? `${scenario.carbon.totalKgCO2e.toFixed(0)} kg` : "—"} subtitle="indicative" icon={<Cloud />} />
        <MetricCard title="Best plan" value={best ? `${best.score}/100` : "—"} subtitle={best?.name ?? "not generated"} icon={<BarChart3 />} />
      </div>
      {chart.length > 0 && <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel"><h2 className="text-lg font-bold">Optimization history</h2><div className="mt-4 h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={chart}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="volume" fill="#0f766e" /><Bar dataKey="payload" fill="#2563eb" /><Bar dataKey="score" fill="#f59e0b" /></BarChart></ResponsiveContainer></div></div>}
    </section>
  );
}
