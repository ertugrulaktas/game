"use client";

import { useLoadOptimaStore } from "@/store/useLoadOptimaStore";

export function SavedScenarios() {
  const { savedScenarios } = useLoadOptimaStore();
  return (
    <section id="saved" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">Saved Scenarios</p><h2 className="text-xl font-bold">Local scenario library</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">{savedScenarios.slice(0, 6).map((s) => <div key={s.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-semibold">{s.scenarioName}</p><p className="text-sm text-slate-500">{s.vehicle.vehicleName} · {s.cargoItems.length} cargo rows · {new Date(s.updatedAt).toLocaleString()}</p></div>)}</div>
    </section>
  );
}
