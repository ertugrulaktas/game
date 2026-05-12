"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { calculateCarbon } from "@/lib/carbon";
import { createDemoScenario, mixedBoxCargo, vehiclePresets } from "@/lib/demo-data";
import { optimizeLoading } from "@/lib/optimizer";
import { CargoItem, Scenario, VehicleType } from "@/types/domain";

interface LoadOptimaState {
  scenario: Scenario;
  savedScenarios: Scenario[];
  selectedPlanId?: string;
  distanceKm: number;
  routeName: string;
  returnTripAssumption: boolean;
  setScenarioName: (name: string) => void;
  loadDemo: (kind: "fertilizer" | "mixed") => void;
  setVehicle: (vehicle: VehicleType) => void;
  addCargo: () => void;
  updateCargo: (id: string, patch: Partial<CargoItem>) => void;
  deleteCargo: (id: string) => void;
  duplicateCargo: (id: string) => void;
  importCargo: (items: CargoItem[]) => void;
  runOptimization: () => void;
  selectPlan: (id: string) => void;
  setCarbonInputs: (patch: Partial<Pick<LoadOptimaState, "distanceKm" | "routeName" | "returnTripAssumption">>) => void;
  calculateCarbon: () => void;
  saveScenario: () => void;
}

const initialScenario = createDemoScenario("fertilizer");

export const useLoadOptimaStore = create<LoadOptimaState>()(
  persist(
    (set, get) => ({
      scenario: initialScenario,
      savedScenarios: [initialScenario, createDemoScenario("mixed")],
      selectedPlanId: undefined,
      distanceKm: 450,
      routeName: "Factory to export port",
      returnTripAssumption: false,
      setScenarioName: (name) => set((state) => ({ scenario: { ...state.scenario, scenarioName: name, updatedAt: new Date().toISOString() } })),
      loadDemo: (kind) => set({ scenario: createDemoScenario(kind), selectedPlanId: undefined }),
      setVehicle: (vehicle) => set((state) => ({ scenario: { ...state.scenario, vehicle, plans: [], updatedAt: new Date().toISOString() }, selectedPlanId: undefined })),
      addCargo: () =>
        set((state) => ({
          scenario: {
            ...state.scenario,
            cargoItems: [
              ...state.scenario.cargoItems,
              { id: `cargo-${Date.now()}`, itemCode: "NEW", itemName: "New cargo", category: "General", lengthCm: 100, widthCm: 80, heightCm: 80, weightKg: 100, quantity: 1, stackable: true, maxStackLevel: 2, fragile: false, rotatable: true, allowedRotations: { x: true, y: true, z: true }, hazardous: false, loadingPriority: 2, deliverySequence: 1, palletized: false, color: "#0f766e" }
            ]
          }
        })),
      updateCargo: (id, patch) => set((state) => ({ scenario: { ...state.scenario, plans: [], cargoItems: state.scenario.cargoItems.map((item) => (item.id === id ? { ...item, ...patch } : item)) } })),
      deleteCargo: (id) => set((state) => ({ scenario: { ...state.scenario, plans: [], cargoItems: state.scenario.cargoItems.filter((item) => item.id !== id) } })),
      duplicateCargo: (id) => set((state) => ({ scenario: { ...state.scenario, plans: [], cargoItems: state.scenario.cargoItems.flatMap((item) => (item.id === id ? [item, { ...item, id: `${item.id}-copy-${Date.now()}`, itemCode: `${item.itemCode}-COPY` }] : [item])) } })),
      importCargo: (items) => set((state) => ({ scenario: { ...state.scenario, cargoItems: items, plans: [] }, selectedPlanId: undefined })),
      runOptimization: () => {
        const { scenario } = get();
        const plans = optimizeLoading(scenario.cargoItems, scenario.vehicle);
        set({ scenario: { ...scenario, plans, selectedPlanId: plans[0]?.id, updatedAt: new Date().toISOString() }, selectedPlanId: plans[0]?.id });
      },
      selectPlan: (id) => set((state) => ({ selectedPlanId: id, scenario: { ...state.scenario, selectedPlanId: id } })),
      setCarbonInputs: (patch) => set((state) => ({ ...state, ...patch })),
      calculateCarbon: () => {
        const { scenario, selectedPlanId, distanceKm, routeName, returnTripAssumption } = get();
        const plan = scenario.plans.find((p) => p.id === selectedPlanId) ?? scenario.plans[0];
        if (!plan) return;
        set({ scenario: { ...scenario, carbon: calculateCarbon({ plan, vehicle: scenario.vehicle, distanceKm, routeName, returnTripAssumption }) } });
      },
      saveScenario: () => {
        const { scenario, savedScenarios } = get();
        const snapshot = { ...scenario, id: `${scenario.id}-${Date.now()}`, updatedAt: new Date().toISOString() };
        set({ savedScenarios: [snapshot, ...savedScenarios.filter((s) => s.id !== snapshot.id)] });
      }
    }),
    { name: "loadoptima-ai-mvp" }
  )
);

export { vehiclePresets, mixedBoxCargo };
