"use client";

import { Truck } from "lucide-react";
import { m3, kg } from "@/lib/utils";
import { useLoadOptimaStore, vehiclePresets } from "@/store/useLoadOptimaStore";

export function VehicleSelector() {
  const { scenario, setVehicle } = useLoadOptimaStore();
  return (
    <section id="vehicle" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel">
      <div className="flex items-center gap-3"><Truck className="h-6 w-6 text-accent" /><div><p className="text-sm font-semibold uppercase tracking-wide text-accent">Vehicle & Container Selection</p><h2 className="text-xl font-bold">Capacity profile</h2></div></div>
      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {vehiclePresets.map((vehicle) => (
          <button key={vehicle.id} onClick={() => setVehicle(vehicle)} className={`rounded-2xl border p-4 text-left transition hover:border-accent ${scenario.vehicle.id === vehicle.id ? "border-accent bg-teal-50" : "border-slate-200 bg-white"}`}>
            <p className="font-semibold text-ink">{vehicle.vehicleName}</p>
            <p className="text-xs uppercase text-slate-500">{vehicle.vehicleType}</p>
            <div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-accent" style={{ width: `${Math.min(100, vehicle.maxVolumeM3)}%` }} /></div>
            <p className="mt-2 text-xs text-slate-600">{vehicle.innerLengthCm}×{vehicle.innerWidthCm}×{vehicle.innerHeightCm} cm</p>
            <p className="text-xs text-slate-600">{m3(vehicle.maxVolumeM3)} · {kg(vehicle.maxPayloadKg)}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
