"use client";

import { Upload } from "lucide-react";
import { parseWorkbook, downloadTemplate } from "@/lib/exporters";
import { validateCargoItem, kg, m3, volumeM3 } from "@/lib/utils";
import { useLoadOptimaStore } from "@/store/useLoadOptimaStore";

export function CargoTable() {
  const { scenario, addCargo, updateCargo, deleteCargo, duplicateCargo, importCargo } = useLoadOptimaStore();
  const totalWeight = scenario.cargoItems.reduce((s, i) => s + i.weightKg * i.quantity, 0);
  const totalVolume = scenario.cargoItems.reduce((s, i) => s + volumeM3(i.lengthCm, i.widthCm, i.heightCm) * i.quantity, 0);
  const totalQty = scenario.cargoItems.reduce((s, i) => s + i.quantity, 0);
  const allErrors = scenario.cargoItems.flatMap(validateCargoItem);

  return (
    <section id="cargo" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Cargo Input / Excel Upload</p>
          <h2 className="text-xl font-bold text-ink">Manual cargo table</h2>
          <p className="text-sm text-slate-500">Supports mixed cuboids, palletized cargo, stackability, rotation, fragility, hazardous flags, and delivery sequence.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary" onClick={downloadTemplate}>Download Excel template</button>
          <label className="btn-secondary cursor-pointer"><Upload className="mr-2 inline h-4 w-4" />Import CSV/XLSX<input className="hidden" type="file" accept=".xlsx,.xls,.csv" onChange={(e) => e.target.files?.[0] && parseWorkbook(e.target.files[0]).then(importCargo)} /></label>
          <button className="btn-primary" onClick={addCargo}>Add row</button>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-3 text-sm"><b>{totalQty}</b> total units</div>
        <div className="rounded-2xl bg-slate-50 p-3 text-sm"><b>{kg(totalWeight)}</b> total weight</div>
        <div className="rounded-2xl bg-slate-50 p-3 text-sm"><b>{m3(totalVolume)}</b> total cube</div>
      </div>
      {allErrors.length > 0 && <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Validation: {Array.from(new Set(allErrors)).join(" ")}</div>}
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-[1200px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{["Code", "Name", "Cat", "L", "W", "H", "kg", "Qty", "Stack", "Max", "Fragile", "Rotate", "Haz", "Priority", "Delivery", "Actions"].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead>
          <tbody>
            {scenario.cargoItems.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 align-top">
                <td className="px-2 py-2"><input className="input" value={item.itemCode} onChange={(e) => updateCargo(item.id, { itemCode: e.target.value })} /></td>
                <td className="px-2 py-2"><input className="input" value={item.itemName} onChange={(e) => updateCargo(item.id, { itemName: e.target.value })} /></td>
                <td className="px-2 py-2"><input className="input" value={item.category} onChange={(e) => updateCargo(item.id, { category: e.target.value })} /></td>
                {(["lengthCm", "widthCm", "heightCm", "weightKg", "quantity"] as const).map((key) => <td key={key} className="px-2 py-2"><input className="input w-20" type="number" value={item[key]} onChange={(e) => updateCargo(item.id, { [key]: Number(e.target.value) })} /></td>)}
                <td className="px-2 py-2"><input type="checkbox" checked={item.stackable} onChange={(e) => updateCargo(item.id, { stackable: e.target.checked, maxStackLevel: e.target.checked ? item.maxStackLevel : 1 })} /></td>
                <td className="px-2 py-2"><input className="input w-16" type="number" value={item.maxStackLevel} onChange={(e) => updateCargo(item.id, { maxStackLevel: Number(e.target.value) })} /></td>
                <td className="px-2 py-2"><input type="checkbox" checked={item.fragile} onChange={(e) => updateCargo(item.id, { fragile: e.target.checked })} /></td>
                <td className="px-2 py-2"><input type="checkbox" checked={item.rotatable} onChange={(e) => updateCargo(item.id, { rotatable: e.target.checked })} /></td>
                <td className="px-2 py-2"><input type="checkbox" checked={item.hazardous} onChange={(e) => updateCargo(item.id, { hazardous: e.target.checked })} /></td>
                <td className="px-2 py-2"><input className="input w-16" type="number" value={item.loadingPriority} onChange={(e) => updateCargo(item.id, { loadingPriority: Number(e.target.value) })} /></td>
                <td className="px-2 py-2"><input className="input w-16" type="number" value={item.deliverySequence} onChange={(e) => updateCargo(item.id, { deliverySequence: Number(e.target.value) })} /></td>
                <td className="px-2 py-2"><button className="text-accent" onClick={() => duplicateCargo(item.id)}>Duplicate</button><button className="ml-3 text-danger" onClick={() => deleteCargo(item.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
