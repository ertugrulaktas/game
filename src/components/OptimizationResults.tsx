"use client";

import { AlertTriangle, CheckCircle2, Play } from "lucide-react";
import { kg, m3, pct } from "@/lib/utils";
import { useLoadOptimaStore } from "@/store/useLoadOptimaStore";

export function OptimizationResults() {
  const { scenario, selectedPlanId, runOptimization, selectPlan } = useLoadOptimaStore();
  return (
    <section id="results" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-sm font-semibold uppercase tracking-wide text-accent">Optimization Results</p><h2 className="text-xl font-bold">Generated loading alternatives</h2><p className="text-sm text-slate-500">Heuristic 3D bin-packing tests volume, weight, delivery, stackability, and longest-dimension strategies.</p></div>
        <button className="btn-primary" onClick={runOptimization}><Play className="mr-2 inline h-4 w-4" />Run optimization</button>
      </div>
      {scenario.plans.length === 0 ? <div className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">Run optimization to generate at least 3 scenario alternatives.</div> : <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {scenario.plans.slice(0, 3).map((plan) => (
          <button key={plan.id} onClick={() => selectPlan(plan.id)} className={`rounded-2xl border p-4 text-left ${selectedPlanId === plan.id ? "border-accent bg-teal-50" : "border-slate-200 bg-white"}`}>
            <div className="flex items-center justify-between"><h3 className="font-bold capitalize">{plan.name}</h3><span className="rounded-full bg-ink px-3 py-1 text-sm font-bold text-white">{plan.score}</span></div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
              <span>Volume <b>{pct(plan.metrics.volumeUtilization)}</b></span><span>Payload <b>{pct(plan.metrics.payloadUtilization)}</b></span>
              <span>Unused <b>{m3(plan.metrics.unusedVolumeM3)}</b></span><span>Loaded <b>{plan.metrics.loadedItemCount}</b></span>
              <span>Unloaded <b>{plan.metrics.unloadedItemCount}</b></span><span>Weight <b>{kg(plan.metrics.totalWeightKg)}</b></span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">{plan.recommendationTags.map((t) => <span key={t} className="badge bg-teal-100 text-teal-800">{t}</span>)}</div>
            <div className="mt-3 space-y-1">{plan.riskFlags.slice(0, 3).map((risk) => <p key={risk.label} className={`flex gap-2 text-xs ${risk.severity === "critical" ? "text-danger" : "text-amber-700"}`}>{risk.severity === "critical" ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}{risk.label}</p>)}</div>
          </button>
        ))}
      </div>}
    </section>
  );
}
