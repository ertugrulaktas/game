"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { useMemo, useState } from "react";
import { Box, Eye, EyeOff } from "lucide-react";
import { useLoadOptimaStore } from "@/store/useLoadOptimaStore";

function CargoBox({ p, scale }: { p: any; scale: number }) {
  const [hover, setHover] = useState(false);
  return (
    <group position={[(p.x + p.lengthCm / 2) * scale, (p.z + p.heightCm / 2) * scale, (p.y + p.widthCm / 2) * scale]}>
      <mesh onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
        <boxGeometry args={[p.lengthCm * scale, p.heightCm * scale, p.widthCm * scale]} />
        <meshStandardMaterial color={p.warnings?.length ? "#f59e0b" : p.color} transparent opacity={hover ? 0.92 : 0.76} />
      </mesh>
      {hover && <Text position={[0, p.heightCm * scale / 2 + 0.2, 0]} fontSize={0.22} color="#0f172a" anchorX="center">{p.itemCode} · #{p.loadingOrder}</Text>}
    </group>
  );
}

export function LoadingViewer3D() {
  const { scenario, selectedPlanId } = useLoadOptimaStore();
  const plan = scenario.plans.find((p) => p.id === selectedPlanId) ?? scenario.plans[0];
  const [view, setView] = useState<"3d" | "top" | "side" | "rear">("3d");
  const [hidden, setHidden] = useState<string[]>([]);
  const categories = Array.from(new Set(plan?.placements.map((p) => p.category) ?? []));
  const scale = 0.012;
  const camera = useMemo(() => {
    const v = scenario.vehicle;
    if (view === "top") return { position: [v.innerLengthCm * scale / 2, 16, v.innerWidthCm * scale / 2] as [number, number, number] };
    if (view === "side") return { position: [v.innerLengthCm * scale / 2, 5, -12] as [number, number, number] };
    if (view === "rear") return { position: [-10, 5, v.innerWidthCm * scale / 2] as [number, number, number] };
    return { position: [9, 7, 12] as [number, number, number] };
  }, [view, scenario.vehicle]);

  if (!plan) return <section id="viewer" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel"><h2 className="text-xl font-bold">3D Loading Viewer</h2><p className="mt-3 text-sm text-slate-500">Run optimization to inspect the 3D loading simulation.</p></section>;

  const v = scenario.vehicle;
  return (
    <section id="viewer" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><Box className="h-6 w-6 text-accent" /><div><p className="text-sm font-semibold uppercase tracking-wide text-accent">3D Loading Viewer</p><h2 className="text-xl font-bold">Interactive cargo simulation</h2></div></div><div className="flex gap-2">{(["3d", "top", "side", "rear"] as const).map((name) => <button key={name} className={`btn-secondary ${view === name ? "border-accent text-accent" : ""}`} onClick={() => setView(name)}>{name.toUpperCase()}</button>)}</div></div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_220px]">
        <div className="h-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white">
          <Canvas camera={{ ...camera, fov: 45 }}>
            <ambientLight intensity={0.75} /><directionalLight position={[5, 10, 5]} intensity={1} />
            <group position={[-v.innerLengthCm * scale / 2, -0.2, -v.innerWidthCm * scale / 2]}>
              <mesh position={[v.innerLengthCm * scale / 2, v.innerHeightCm * scale / 2, v.innerWidthCm * scale / 2]}>
                <boxGeometry args={[v.innerLengthCm * scale, v.innerHeightCm * scale, v.innerWidthCm * scale]} />
                <meshStandardMaterial color="#0f766e" wireframe transparent opacity={0.16} />
              </mesh>
              {plan.placements.filter((p) => !hidden.includes(p.category)).map((p) => <CargoBox key={p.id} p={p} scale={scale} />)}
              <mesh position={[plan.metrics.centerOfGravity.x * scale, plan.metrics.centerOfGravity.z * scale, plan.metrics.centerOfGravity.y * scale]}>
                <sphereGeometry args={[0.18, 24, 24]} /><meshStandardMaterial color="#dc2626" />
              </mesh>
              <Text position={[plan.metrics.centerOfGravity.x * scale, plan.metrics.centerOfGravity.z * scale + 0.35, plan.metrics.centerOfGravity.y * scale]} fontSize={0.2} color="#dc2626">COG</Text>
            </group>
            <OrbitControls enablePan enableZoom enableRotate target={[0, 2, 0]} />
          </Canvas>
        </div>
        <aside className="rounded-2xl bg-slate-50 p-4">
          <h3 className="font-semibold">Layers & empty space</h3><p className="mt-1 text-xs text-slate-500">Transparent wireframe shows unused vehicle envelope. Warning-colored items have soft rule issues.</p>
          <div className="mt-4 space-y-2">{categories.map((cat) => <button key={cat} onClick={() => setHidden((h) => h.includes(cat) ? h.filter((x) => x !== cat) : [...h, cat])} className="flex w-full items-center justify-between rounded-xl bg-white px-3 py-2 text-sm"><span>{cat}</span>{hidden.includes(cat) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4 text-accent" />}</button>)}</div>
          <div className="mt-4 rounded-xl bg-white p-3 text-xs text-slate-600">Step-by-step order starts from placement #1. Hover boxes for labels.</div>
        </aside>
      </div>
    </section>
  );
}
