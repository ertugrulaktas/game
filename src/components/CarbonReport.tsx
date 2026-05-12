"use client";

import { Leaf } from "lucide-react";
import { downloadPdfReport, downloadWorkbook } from "@/lib/exporters";
import { pct } from "@/lib/utils";
import { useLoadOptimaStore } from "@/store/useLoadOptimaStore";

export function CarbonReport() {
  const { scenario, selectedPlanId, distanceKm, routeName, returnTripAssumption, setCarbonInputs, calculateCarbon, saveScenario } = useLoadOptimaStore();
  const plan = scenario.plans.find((p) => p.id === selectedPlanId) ?? scenario.plans[0];
  return (
    <section id="carbon" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><Leaf className="h-6 w-6 text-accent" /><div><p className="text-sm font-semibold uppercase tracking-wide text-accent">Carbon Footprint Report</p><h2 className="text-xl font-bold">CBAM / sustainability-ready estimate</h2></div></div><div className="flex flex-wrap gap-2"><button className="btn-secondary" onClick={saveScenario}>Save scenario</button><button className="btn-secondary" onClick={() => downloadWorkbook(scenario, plan, scenario.carbon)}>Export Excel</button><button className="btn-secondary" onClick={() => downloadPdfReport(scenario, plan, scenario.carbon)}>Export PDF</button><button className="btn-primary" onClick={calculateCarbon} disabled={!plan}>Calculate CO₂e</button></div></div>
      <div className="mt-5 grid gap-4 md:grid-cols-4"><label className="text-sm font-medium">Route name<input className="input mt-1" value={routeName} onChange={(e) => setCarbonInputs({ routeName: e.target.value })} /></label><label className="text-sm font-medium">Distance km<input className="input mt-1" type="number" value={distanceKm} onChange={(e) => setCarbonInputs({ distanceKm: Number(e.target.value) })} /></label><label className="text-sm font-medium">Emission factor<input className="input mt-1" readOnly value={`${scenario.vehicle.emissionFactorKgCO2PerKm} kgCO2/km`} /></label><label className="mt-7 flex items-center gap-2 text-sm"><input type="checkbox" checked={returnTripAssumption} onChange={(e) => setCarbonInputs({ returnTripAssumption: e.target.checked })} />Include return trip</label></div>
      {scenario.carbon && <div className="mt-5 grid gap-4 md:grid-cols-4"><div className="rounded-2xl bg-teal-50 p-4"><p className="text-xs text-teal-700">Total CO₂e</p><p className="text-2xl font-bold">{scenario.carbon.totalKgCO2e.toFixed(1)} kg</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">kgCO₂e / ton-km</p><p className="text-2xl font-bold">{scenario.carbon.kgCO2ePerTonKm.toFixed(3)}</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Intensity score</p><p className="text-2xl font-bold">{pct(scenario.carbon.carbonIntensityScore)}</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Vehicles</p><p className="text-2xl font-bold">{scenario.carbon.numberOfVehicles}</p></div><p className="md:col-span-4 rounded-2xl border border-slate-200 p-4 text-sm text-slate-600"><b>Recommendation:</b> {scenario.carbon.recommendation}<br /><b>Disclaimer:</b> {scenario.carbon.disclaimer}</p></div>}
    </section>
  );
}
