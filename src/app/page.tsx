import { CarbonReport } from "@/components/CarbonReport";
import { CargoTable } from "@/components/CargoTable";
import { Dashboard } from "@/components/Dashboard";
import { LoadingViewer3D } from "@/components/LoadingViewer3D";
import { OptimizationResults } from "@/components/OptimizationResults";
import { SavedScenarios } from "@/components/SavedScenarios";
import { ScenarioComparison } from "@/components/ScenarioComparison";
import { SettingsMasterData } from "@/components/SettingsMasterData";
import { VehicleSelector } from "@/components/VehicleSelector";

const nav = [
  ["Dashboard", "#dashboard"], ["New Scenario", "#cargo"], ["Vehicle", "#vehicle"], ["Results", "#results"], ["3D Viewer", "#viewer"], ["Compare", "#comparison"], ["Carbon", "#carbon"], ["Saved", "#saved"], ["Settings", "#settings"]
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3"><div className="font-bold text-ink">LoadOptima <span className="text-accent">AI</span></div><nav className="hidden flex-wrap gap-1 lg:flex">{nav.map(([label, href]) => <a key={href} href={href} className="rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-ink">{label}</a>)}</nav></div></header>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6"><Dashboard /><CargoTable /><VehicleSelector /><OptimizationResults /><LoadingViewer3D /><ScenarioComparison /><CarbonReport /><SavedScenarios /><SettingsMasterData /></div>
    </main>
  );
}
