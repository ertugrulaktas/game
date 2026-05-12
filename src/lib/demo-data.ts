import { CargoItem, Scenario, VehicleType } from "@/types/domain";

export const vehiclePresets: VehicleType[] = [
  { id: "20ft", vehicleName: "20 ft Container", vehicleType: "container", innerLengthCm: 589, innerWidthCm: 235, innerHeightCm: 239, maxPayloadKg: 28200, emptyWeightKg: 2300, fuelType: "diesel", emissionFactorKgCO2PerKm: 0.92, maxVolumeM3: 33.1, loadingDoorPosition: "rear", allowSideLoading: false, allowTopLoading: false },
  { id: "40ft", vehicleName: "40 ft Container", vehicleType: "container", innerLengthCm: 1203, innerWidthCm: 235, innerHeightCm: 239, maxPayloadKg: 26700, emptyWeightKg: 3800, fuelType: "diesel", emissionFactorKgCO2PerKm: 1.08, maxVolumeM3: 67.7, loadingDoorPosition: "rear", allowSideLoading: false, allowTopLoading: false },
  { id: "40hc", vehicleName: "40 ft High Cube", vehicleType: "container", innerLengthCm: 1203, innerWidthCm: 235, innerHeightCm: 269, maxPayloadKg: 26580, emptyWeightKg: 3900, fuelType: "diesel", emissionFactorKgCO2PerKm: 1.12, maxVolumeM3: 76.3, loadingDoorPosition: "rear", allowSideLoading: false, allowTopLoading: false },
  { id: "semi", vehicleName: "Standard Semi-trailer", vehicleType: "semi-trailer", innerLengthCm: 1360, innerWidthCm: 248, innerHeightCm: 270, maxPayloadKg: 24000, emptyWeightKg: 7200, fuelType: "diesel", emissionFactorKgCO2PerKm: 0.98, maxVolumeM3: 91.1, loadingDoorPosition: "rear+side", allowSideLoading: true, allowTopLoading: false },
  { id: "box", vehicleName: "Box Truck", vehicleType: "box-truck", innerLengthCm: 730, innerWidthCm: 245, innerHeightCm: 250, maxPayloadKg: 7500, emptyWeightKg: 5200, fuelType: "diesel", emissionFactorKgCO2PerKm: 0.62, maxVolumeM3: 44.7, loadingDoorPosition: "rear", allowSideLoading: false, allowTopLoading: false },
  { id: "lorry", vehicleName: "Lorry", vehicleType: "lorry", innerLengthCm: 900, innerWidthCm: 245, innerHeightCm: 260, maxPayloadKg: 12000, emptyWeightKg: 6900, fuelType: "diesel", emissionFactorKgCO2PerKm: 0.76, maxVolumeM3: 57.3, loadingDoorPosition: "rear+side", allowSideLoading: true, allowTopLoading: false },
  { id: "van", vehicleName: "Van", vehicleType: "van", innerLengthCm: 430, innerWidthCm: 178, innerHeightCm: 190, maxPayloadKg: 1400, emptyWeightKg: 2100, fuelType: "diesel", emissionFactorKgCO2PerKm: 0.29, maxVolumeM3: 14.5, loadingDoorPosition: "rear+side", allowSideLoading: true, allowTopLoading: false },
  { id: "custom", vehicleName: "Custom Vehicle", vehicleType: "custom", innerLengthCm: 1000, innerWidthCm: 240, innerHeightCm: 240, maxPayloadKg: 15000, emptyWeightKg: 6000, fuelType: "diesel", emissionFactorKgCO2PerKm: 0.8, maxVolumeM3: 57.6, loadingDoorPosition: "rear", allowSideLoading: false, allowTopLoading: false, customConstraints: "Editable custom capacity profile." }
];

export const fertilizerCargo: CargoItem[] = [
  { id: "fert-1", itemCode: "NPK-120", itemName: "Granular fertilizer bags - Euro pallet", category: "Fertilizer", lengthCm: 120, widthCm: 80, heightCm: 150, weightKg: 1050, quantity: 14, stackable: true, maxStackLevel: 2, fragile: false, rotatable: true, allowedRotations: { x: false, y: false, z: true }, hazardous: false, loadingPriority: 2, deliverySequence: 3, palletized: true, palletType: "EUR", color: "#0f766e", notes: "Wrapped 25 kg bags." },
  { id: "fert-2", itemCode: "UREA-100", itemName: "Urea pallet - industrial", category: "Fertilizer", lengthCm: 110, widthCm: 110, heightCm: 130, weightKg: 950, quantity: 10, stackable: true, maxStackLevel: 2, fragile: false, rotatable: true, allowedRotations: { x: false, y: false, z: true }, hazardous: false, loadingPriority: 1, deliverySequence: 2, palletized: true, palletType: "Industrial", color: "#2563eb" },
  { id: "fert-3", itemCode: "MICRO-80", itemName: "Micronutrient pallet", category: "Additives", lengthCm: 120, widthCm: 100, heightCm: 110, weightKg: 720, quantity: 6, stackable: false, maxStackLevel: 1, fragile: true, rotatable: true, allowedRotations: { x: false, y: false, z: true }, hazardous: false, loadingPriority: 3, deliverySequence: 1, palletized: true, palletType: "ISO", color: "#f59e0b", notes: "Do not top-load." }
];

export const mixedBoxCargo: CargoItem[] = [
  { id: "box-1", itemCode: "MTR-001", itemName: "Motor assemblies", category: "Machinery", lengthCm: 90, widthCm: 60, heightCm: 55, weightKg: 180, quantity: 12, stackable: true, maxStackLevel: 3, fragile: false, rotatable: true, allowedRotations: { x: true, y: true, z: true }, hazardous: false, loadingPriority: 2, deliverySequence: 2, palletized: false, color: "#7c3aed" },
  { id: "box-2", itemCode: "ELC-440", itemName: "Electrical cabinet", category: "Electronics", lengthCm: 120, widthCm: 60, heightCm: 180, weightKg: 240, quantity: 4, stackable: false, maxStackLevel: 1, fragile: true, rotatable: false, allowedRotations: { x: false, y: false, z: false }, hazardous: false, loadingPriority: 1, deliverySequence: 1, palletized: false, color: "#dc2626" },
  { id: "box-3", itemCode: "SP-030", itemName: "Spare parts cartons", category: "Cartons", lengthCm: 50, widthCm: 40, heightCm: 35, weightKg: 28, quantity: 40, stackable: true, maxStackLevel: 5, fragile: false, rotatable: true, allowedRotations: { x: true, y: true, z: true }, hazardous: false, loadingPriority: 3, deliverySequence: 4, palletized: false, color: "#0891b2" },
  { id: "box-4", itemCode: "CHEM-12", itemName: "Sealed maintenance chemical", category: "Hazardous", lengthCm: 70, widthCm: 50, heightCm: 60, weightKg: 75, quantity: 8, stackable: false, maxStackLevel: 1, fragile: false, rotatable: true, allowedRotations: { x: false, y: false, z: true }, hazardous: true, loadingPriority: 1, deliverySequence: 3, palletized: false, color: "#ea580c", notes: "Segregate and keep upright." }
];

export function createDemoScenario(kind: "fertilizer" | "mixed" = "fertilizer"): Scenario {
  const isFert = kind === "fertilizer";
  return {
    id: `scenario-${kind}`,
    scenarioName: isFert ? "Fertilizer export load - semi-trailer" : "Mixed industrial boxes - 40 ft container",
    companyId: "demo-company",
    cargoItems: isFert ? fertilizerCargo : mixedBoxCargo,
    vehicle: isFert ? vehiclePresets[3] : vehiclePresets[1],
    plans: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
