import { CargoItem, LoadingPlan, Placement, RiskFlag, SortStrategy, VehicleType } from "@/types/domain";
import { clamp, expandCargo, isOverlapping, volumeM3 } from "@/lib/utils";

const strategies: SortStrategy[] = ["largest-volume", "heaviest", "longest", "delivery-sequence", "stackability"];

type Oriented = CargoItem & { oLength: number; oWidth: number; oHeight: number };

function orientations(item: CargoItem): Oriented[] {
  const base = [{ l: item.lengthCm, w: item.widthCm, h: item.heightCm }];
  const variants = item.rotatable
    ? [
        ...base,
        ...(item.allowedRotations.z ? [{ l: item.widthCm, w: item.lengthCm, h: item.heightCm }] : []),
        ...(item.allowedRotations.x ? [{ l: item.lengthCm, w: item.heightCm, h: item.widthCm }] : []),
        ...(item.allowedRotations.y ? [{ l: item.heightCm, w: item.widthCm, h: item.lengthCm }] : [])
      ]
    : base;
  return Array.from(new Map(variants.map((v) => [`${v.l}-${v.w}-${v.h}`, v])).values()).map((v) => ({ ...item, oLength: v.l, oWidth: v.w, oHeight: v.h }));
}

function sortItems(items: CargoItem[], strategy: SortStrategy) {
  return [...items].sort((a, b) => {
    if (strategy === "largest-volume") return b.lengthCm * b.widthCm * b.heightCm - a.lengthCm * a.widthCm * a.heightCm;
    if (strategy === "heaviest") return b.weightKg - a.weightKg;
    if (strategy === "longest") return Math.max(b.lengthCm, b.widthCm, b.heightCm) - Math.max(a.lengthCm, a.widthCm, a.heightCm);
    if (strategy === "delivery-sequence") return b.deliverySequence - a.deliverySequence || a.loadingPriority - b.loadingPriority;
    return Number(b.stackable) - Number(a.stackable) || b.weightKg - a.weightKg;
  });
}

function candidates(vehicle: VehicleType, placements: Placement[]) {
  const points = [{ x: 0, y: 0, z: 0 }];
  for (const p of placements) {
    points.push({ x: p.x + p.lengthCm, y: p.y, z: p.z }, { x: p.x, y: p.y + p.widthCm, z: p.z }, { x: p.x, y: p.y, z: p.z + p.heightCm });
  }
  return Array.from(new Map(points.map((p) => [`${p.x}-${p.y}-${p.z}`, p])).values())
    .filter((p) => p.x < vehicle.innerLengthCm && p.y < vehicle.innerWidthCm && p.z < vehicle.innerHeightCm)
    .sort((a, b) => a.z - b.z || a.x - b.x || Math.abs(a.y - vehicle.innerWidthCm / 2) - Math.abs(b.y - vehicle.innerWidthCm / 2));
}

function supportRatio(candidate: Placement, placements: Placement[]) {
  if (candidate.z === 0) return 1;
  const supporters = placements.filter((p) => Math.abs(p.z + p.heightCm - candidate.z) < 0.01);
  const overlapArea = supporters.reduce((sum, p) => {
    const xOverlap = Math.max(0, Math.min(candidate.x + candidate.lengthCm, p.x + p.lengthCm) - Math.max(candidate.x, p.x));
    const yOverlap = Math.max(0, Math.min(candidate.y + candidate.widthCm, p.y + p.widthCm) - Math.max(candidate.y, p.y));
    return sum + xOverlap * yOverlap;
  }, 0);
  return overlapArea / (candidate.lengthCm * candidate.widthCm);
}

function violatesStacking(candidate: Placement, placements: Placement[], catalog: CargoItem[]) {
  const warnings: string[] = [];
  const underneath = placements.filter((p) => Math.abs(p.z + p.heightCm - candidate.z) < 0.01 && isOverlapping({ ...candidate, z: candidate.z - 0.1 }, p));
  for (const below of underneath) {
    const source = catalog.find((i) => candidate.cargoItemId.startsWith(i.id));
    const belowSource = catalog.find((i) => below.cargoItemId.startsWith(i.id));
    if (!below.stackable) warnings.push(`${below.itemCode} is non-stackable but has cargo above.`);
    if (below.fragile && candidate.weightKg > below.weightKg * 0.35) warnings.push(`Heavy item above fragile ${below.itemCode}.`);
    if (belowSource && candidate.z / Math.max(1, belowSource.heightCm) + 1 > belowSource.maxStackLevel) warnings.push(`Max stack level exceeded for ${below.itemCode}.`);
    if (source?.hazardous && belowSource?.category !== source.category) warnings.push(`Hazardous ${source.itemCode} should be segregated.`);
  }
  if (candidate.z > 0 && supportRatio(candidate, placements) < 0.6) warnings.push("Insufficient floor/support contact.");
  return warnings;
}

function placeWithStrategy(catalog: CargoItem[], vehicle: VehicleType, strategy: SortStrategy): LoadingPlan {
  const items = sortItems(expandCargo(catalog), strategy);
  const placements: Placement[] = [];
  const unloaded: LoadingPlan["unloaded"] = [];
  let weight = 0;

  for (const item of items) {
    if (weight + item.weightKg > vehicle.maxPayloadKg) {
      unloaded.push({ cargoItemId: item.id, itemCode: item.itemCode, reason: "Vehicle max payload exceeded." });
      continue;
    }
    let placed: Placement | undefined;
    for (const point of candidates(vehicle, placements)) {
      for (const oriented of orientations(item)) {
        const candidate: Placement = {
          id: `pl-${item.id}`,
          cargoItemId: item.id,
          itemCode: item.itemCode,
          itemName: item.itemName,
          category: item.category,
          x: point.x,
          y: point.y,
          z: point.z,
          lengthCm: oriented.oLength,
          widthCm: oriented.oWidth,
          heightCm: oriented.oHeight,
          weightKg: item.weightKg,
          color: item.color,
          loadingOrder: placements.length + 1,
          deliverySequence: item.deliverySequence,
          fragile: item.fragile,
          stackable: item.stackable,
          warnings: []
        };
        const inBounds = candidate.x + candidate.lengthCm <= vehicle.innerLengthCm && candidate.y + candidate.widthCm <= vehicle.innerWidthCm && candidate.z + candidate.heightCm <= vehicle.innerHeightCm;
        if (!inBounds || placements.some((p) => isOverlapping(candidate, p))) continue;
        const stackWarnings = violatesStacking(candidate, placements, catalog);
        if (stackWarnings.some((w) => w.includes("non-stackable") || w.includes("Heavy item"))) continue;
        candidate.warnings = stackWarnings;
        placed = candidate;
        break;
      }
      if (placed) break;
    }
    if (placed) {
      placements.push(placed);
      weight += item.weightKg;
    } else {
      unloaded.push({ cargoItemId: item.id, itemCode: item.itemCode, reason: "No feasible 3D position found." });
    }
  }

  const vehicleVolume = vehicle.maxVolumeM3 || volumeM3(vehicle.innerLengthCm, vehicle.innerWidthCm, vehicle.innerHeightCm);
  const cargoVolume = placements.reduce((s, p) => s + volumeM3(p.lengthCm, p.widthCm, p.heightCm), 0);
  const floorArea = vehicle.innerLengthCm * vehicle.innerWidthCm;
  const usedFloor = placements.filter((p) => p.z === 0).reduce((s, p) => s + p.lengthCm * p.widthCm, 0);
  const totalMoment = placements.reduce((s, p) => s + p.weightKg, 0) || 1;
  const cog = {
    x: placements.reduce((s, p) => s + (p.x + p.lengthCm / 2) * p.weightKg, 0) / totalMoment,
    y: placements.reduce((s, p) => s + (p.y + p.widthCm / 2) * p.weightKg, 0) / totalMoment,
    z: placements.reduce((s, p) => s + (p.z + p.heightCm / 2) * p.weightKg, 0) / totalMoment
  };
  const centerDistance = Math.abs(cog.x / vehicle.innerLengthCm - 0.5) + Math.abs(cog.y / vehicle.innerWidthCm - 0.5) + Math.max(0, cog.z / vehicle.innerHeightCm - 0.42);
  const weightBalanceScore = clamp(1 - centerDistance, 0, 1);
  const ruleWarnings = placements.reduce((s, p) => s + p.warnings.length, 0);
  const ruleComplianceScore = clamp(1 - (ruleWarnings + unloaded.length * 0.7) / Math.max(1, items.length), 0, 1);
  const sequenceViolations = placements.filter((p, i) => i > 0 && p.deliverySequence > placements[i - 1].deliverySequence).length;
  const sequenceEfficiencyScore = clamp(1 - sequenceViolations / Math.max(1, placements.length), 0, 1);
  const volumeUtilization = clamp(cargoVolume / vehicleVolume, 0, 1);
  const payloadUtilization = clamp(weight / vehicle.maxPayloadKg, 0, 1);
  const score = Math.round(100 * (volumeUtilization * 0.3 + payloadUtilization * 0.2 + weightBalanceScore * 0.2 + ruleComplianceScore * 0.2 + sequenceEfficiencyScore * 0.1));
  const riskFlags: RiskFlag[] = [];
  if (unloaded.length) riskFlags.push({ severity: "critical", label: "Unloaded cargo", description: `${unloaded.length} units could not be loaded.` });
  if (payloadUtilization > 0.95) riskFlags.push({ severity: "warning", label: "Payload close to limit", description: "Payload utilization exceeds 95%." });
  if (weightBalanceScore < 0.72) riskFlags.push({ severity: "warning", label: "Center of gravity risk", description: "Weight distribution is away from the geometric center." });
  if (ruleWarnings) riskFlags.push({ severity: "warning", label: "Rule warnings", description: `${ruleWarnings} soft rule warnings detected.` });
  if (volumeUtilization < 0.55) riskFlags.push({ severity: "info", label: "Empty volume", description: "Substantial unused cube remains; consider consolidation or smaller vehicle." });

  return {
    id: `plan-${strategy}`,
    name: `${strategy.replace(/-/g, " ")} plan`,
    strategy,
    placements,
    unloaded,
    metrics: {
      volumeUtilization,
      floorUtilization: clamp(usedFloor / floorArea, 0, 1),
      payloadUtilization,
      unusedVolumeM3: Math.max(0, vehicleVolume - cargoVolume),
      loadedItemCount: placements.length,
      unloadedItemCount: unloaded.length,
      totalWeightKg: weight,
      totalVolumeM3: cargoVolume,
      estimatedVehiclesNeeded: Math.max(1, Math.ceil(Math.max(catalog.reduce((s, i) => s + i.weightKg * i.quantity, 0) / vehicle.maxPayloadKg, catalog.reduce((s, i) => s + volumeM3(i.lengthCm, i.widthCm, i.heightCm) * i.quantity, 0) / vehicleVolume))),
      centerOfGravity: cog,
      weightBalanceScore,
      ruleComplianceScore,
      sequenceEfficiencyScore,
      riskScore: clamp(1 - (weightBalanceScore * 0.35 + ruleComplianceScore * 0.45 + sequenceEfficiencyScore * 0.2), 0, 1),
      constraintMode: payloadUtilization > volumeUtilization + 0.12 ? "weight-constrained" : volumeUtilization > payloadUtilization + 0.12 ? "volume-constrained" : "balanced"
    },
    score,
    riskFlags,
    recommendationTags: []
  };
}

export function optimizeLoading(cargoItems: CargoItem[], vehicle: VehicleType): LoadingPlan[] {
  const plans = strategies.map((strategy) => placeWithStrategy(cargoItems, vehicle, strategy)).sort((a, b) => b.score - a.score);
  const bestScore = plans[0]?.score;
  const bestCarbon = [...plans].sort((a, b) => a.metrics.estimatedVehiclesNeeded - b.metrics.estimatedVehiclesNeeded || b.metrics.payloadUtilization - a.metrics.payloadUtilization)[0]?.id;
  const bestUtilization = [...plans].sort((a, b) => b.metrics.volumeUtilization + b.metrics.payloadUtilization - (a.metrics.volumeUtilization + a.metrics.payloadUtilization))[0]?.id;
  const lowestRisk = [...plans].sort((a, b) => a.metrics.riskScore - b.metrics.riskScore)[0]?.id;
  return plans.slice(0, 5).map((plan) => ({
    ...plan,
    recommendationTags: [
      ...(plan.score === bestScore ? ["Best cost scenario"] : []),
      ...(plan.id === bestCarbon ? ["Best carbon scenario"] : []),
      ...(plan.id === bestUtilization ? ["Best utilization scenario"] : []),
      ...(plan.id === lowestRisk ? ["Lowest risk scenario"] : [])
    ]
  }));
}
