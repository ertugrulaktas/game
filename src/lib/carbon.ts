import { CarbonFootprintResult, LoadingPlan, VehicleType } from "@/types/domain";
import { clamp } from "@/lib/utils";

export function calculateCarbon(params: {
  plan: LoadingPlan;
  vehicle: VehicleType;
  distanceKm: number;
  returnTripAssumption: boolean;
  routeName: string;
  emissionFactorKgCO2PerKm?: number;
}): CarbonFootprintResult {
  const distance = Math.max(0, params.distanceKm) * (params.returnTripAssumption ? 2 : 1);
  const vehicles = Math.max(1, params.plan.metrics.estimatedVehiclesNeeded);
  const factor = params.emissionFactorKgCO2PerKm ?? params.vehicle.emissionFactorKgCO2PerKm;
  const utilizationPenalty = 1 + Math.max(0, 0.75 - params.plan.metrics.payloadUtilization) * 0.35;
  const totalKgCO2e = distance * vehicles * factor * utilizationPenalty;
  const tonKm = Math.max(0.001, (params.plan.metrics.totalWeightKg / 1000) * Math.max(1, params.distanceKm));
  const intensity = totalKgCO2e / tonKm;
  const score = clamp(1 - intensity / 0.35, 0, 1);
  return {
    routeName: params.routeName,
    distanceKm: params.distanceKm,
    returnTripAssumption: params.returnTripAssumption,
    numberOfVehicles: vehicles,
    totalKgCO2e,
    kgCO2ePerTonKm: intensity,
    kgCO2ePerShipment: totalKgCO2e,
    carbonIntensityScore: score,
    recommendation:
      score > 0.7
        ? "Efficient carbon profile. Keep utilization high and validate company-specific emission factors."
        : "Consider a higher-utilization scenario, route consolidation, lower-emission vehicle, or split strategy that avoids underfilled return trips.",
    disclaimer:
      "Indicative logistics emissions for planning only. Configure company, route, carrier, fuel, and regulatory factors before CBAM/sustainability disclosure."
  };
}
