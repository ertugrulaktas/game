import { vehiclePresets } from "@/lib/demo-data";

export function SettingsMasterData() {
  return (
    <section id="settings" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">Settings / Master Data</p><h2 className="text-xl font-bold">Extensible data model</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2"><div className="rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold">Vehicle presets</h3><p className="mt-1 text-sm text-slate-500">{vehiclePresets.length} truck, lorry, van, container, semi-trailer, box truck, open/custom-compatible capacity profiles.</p></div><div className="rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold">Future CAD geometry layer</h3><p className="mt-1 text-sm text-slate-500">MVP uses cuboid boxes. Placement model is separated from visualization so STEP, STL, OBJ, DXF, or GLTF importers can later map geometry to bounding boxes and collision meshes.</p></div></div>
    </section>
  );
}
