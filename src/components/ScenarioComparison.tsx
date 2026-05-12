"use client";

import { pct, m3 } from "@/lib/utils";
import { useLoadOptimaStore } from "@/store/useLoadOptimaStore";

export function ScenarioComparison() {
  const { scenario } = useLoadOptimaStore();
  if (!scenario.plans.length) return null;
  return (
    <section id="comparison" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">Scenario Comparison</p><h2 className="text-xl font-bold">Side-by-side optimization metrics</h2>
      <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{["Plan", "Score", "Volume", "Payload", "Unused", "Loaded", "Unloaded", "Vehicles", "Risk", "Recommendations"].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead><tbody>{scenario.plans.map((plan) => <tr key={plan.id} className="border-b border-slate-100"><td className="px-3 py-3 capitalize font-semibold">{plan.name}</td><td className="px-3 py-3">{plan.score}</td><td className="px-3 py-3">{pct(plan.metrics.volumeUtilization)}</td><td className="px-3 py-3">{pct(plan.metrics.payloadUtilization)}</td><td className="px-3 py-3">{m3(plan.metrics.unusedVolumeM3)}</td><td className="px-3 py-3">{plan.metrics.loadedItemCount}</td><td className="px-3 py-3">{plan.metrics.unloadedItemCount}</td><td className="px-3 py-3">{plan.metrics.estimatedVehiclesNeeded}</td><td className="px-3 py-3">{pct(plan.metrics.riskScore)}</td><td className="px-3 py-3"><div className="flex flex-wrap gap-1">{plan.recommendationTags.map((t) => <span key={t} className="badge bg-slate-100 text-slate-700">{t}</span>)}</div></td></tr>)}</tbody></table></div>
    </section>
  );
}
