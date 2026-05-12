export type VehicleKind = "container" | "semi-trailer" | "box-truck" | "lorry" | "van" | "open-truck" | "custom";
export type DoorPosition = "rear" | "side" | "top" | "rear+side";
export type FuelType = "diesel" | "electric" | "lng" | "gasoline" | "hybrid";
export type SortStrategy = "largest-volume" | "heaviest" | "longest" | "delivery-sequence" | "stackability";

export interface CargoItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightKg: number;
  quantity: number;
  stackable: boolean;
  maxStackLevel: number;
  fragile: boolean;
  rotatable: boolean;
  allowedRotations: { x: boolean; y: boolean; z: boolean };
  hazardous: boolean;
  loadingPriority: number;
  deliverySequence: number;
  palletized: boolean;
  palletType?: string;
  color: string;
  notes?: string;
}

export interface VehicleType {
  id: string;
  vehicleName: string;
  vehicleType: VehicleKind;
  innerLengthCm: number;
  innerWidthCm: number;
  innerHeightCm: number;
  maxPayloadKg: number;
  emptyWeightKg: number;
  fuelType: FuelType;
  emissionFactorKgCO2PerKm: number;
  maxVolumeM3: number;
  loadingDoorPosition: DoorPosition;
  allowSideLoading: boolean;
  allowTopLoading: boolean;
  customConstraints?: string;
}

export interface Placement {
  id: string;
  cargoItemId: string;
  itemCode: string;
  itemName: string;
  category: string;
  x: number;
  y: number;
  z: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightKg: number;
  color: string;
  loadingOrder: number;
  deliverySequence: number;
  fragile: boolean;
  stackable: boolean;
  warnings: string[];
}

export interface RiskFlag {
  severity: "info" | "warning" | "critical";
  label: string;
  description: string;
}

export interface LoadingPlan {
  id: string;
  name: string;
  strategy: SortStrategy;
  placements: Placement[];
  unloaded: { cargoItemId: string; itemCode: string; reason: string }[];
  metrics: OptimizationMetrics;
  score: number;
  riskFlags: RiskFlag[];
  recommendationTags: string[];
}

export interface OptimizationMetrics {
  volumeUtilization: number;
  floorUtilization: number;
  payloadUtilization: number;
  unusedVolumeM3: number;
  loadedItemCount: number;
  unloadedItemCount: number;
  totalWeightKg: number;
  totalVolumeM3: number;
  estimatedVehiclesNeeded: number;
  centerOfGravity: { x: number; y: number; z: number };
  weightBalanceScore: number;
  ruleComplianceScore: number;
  sequenceEfficiencyScore: number;
  riskScore: number;
  constraintMode: "volume-constrained" | "weight-constrained" | "balanced";
}

export interface CarbonFootprintResult {
  routeName: string;
  distanceKm: number;
  returnTripAssumption: boolean;
  numberOfVehicles: number;
  totalKgCO2e: number;
  kgCO2ePerTonKm: number;
  kgCO2ePerShipment: number;
  carbonIntensityScore: number;
  recommendation: string;
  disclaimer: string;
}

export interface Scenario {
  id: string;
  scenarioName: string;
  companyId: string;
  cargoItems: CargoItem[];
  vehicle: VehicleType;
  plans: LoadingPlan[];
  selectedPlanId?: string;
  carbon?: CarbonFootprintResult;
  createdAt: string;
  updatedAt: string;
}
