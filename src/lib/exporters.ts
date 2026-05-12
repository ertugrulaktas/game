import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { CargoItem, CarbonFootprintResult, LoadingPlan, Scenario } from "@/types/domain";
import { m3, pct } from "@/lib/utils";

export const cargoTemplateHeaders = [
  "itemCode", "itemName", "category", "lengthCm", "widthCm", "heightCm", "weightKg", "quantity", "stackable", "maxStackLevel", "fragile", "rotatable", "hazardous", "loadingPriority", "deliverySequence", "palletized", "palletType", "color", "notes"
];

export function parseWorkbook(file: File): Promise<CargoItem[]> {
  return file.arrayBuffer().then((buffer) => {
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
    return rows.map((row, index) => ({
      id: `import-${Date.now()}-${index}`,
      itemCode: String(row.itemCode ?? `ITEM-${index + 1}`),
      itemName: String(row.itemName ?? "Imported cargo"),
      category: String(row.category ?? "General"),
      lengthCm: Number(row.lengthCm ?? 0),
      widthCm: Number(row.widthCm ?? 0),
      heightCm: Number(row.heightCm ?? 0),
      weightKg: Number(row.weightKg ?? 0),
      quantity: Number(row.quantity ?? 1),
      stackable: String(row.stackable ?? "true").toLowerCase() !== "false",
      maxStackLevel: Number(row.maxStackLevel ?? 1),
      fragile: String(row.fragile ?? "false").toLowerCase() === "true",
      rotatable: String(row.rotatable ?? "true").toLowerCase() !== "false",
      allowedRotations: { x: true, y: true, z: true },
      hazardous: String(row.hazardous ?? "false").toLowerCase() === "true",
      loadingPriority: Number(row.loadingPriority ?? 2),
      deliverySequence: Number(row.deliverySequence ?? 1),
      palletized: String(row.palletized ?? "false").toLowerCase() === "true",
      palletType: String(row.palletType ?? ""),
      color: String(row.color ?? "#0f766e"),
      notes: String(row.notes ?? "")
    }));
  });
}

export function downloadWorkbook(scenario: Scenario, selectedPlan?: LoadingPlan, carbon?: CarbonFootprintResult) {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(scenario.cargoItems), "Cargo Input");
  if (selectedPlan) {
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(selectedPlan.placements), "Placement Coordinates");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(scenario.plans.map((p) => ({ plan: p.name, score: p.score, volumeUtilization: pct(p.metrics.volumeUtilization), payloadUtilization: pct(p.metrics.payloadUtilization), unusedVolumeM3: p.metrics.unusedVolumeM3, loaded: p.metrics.loadedItemCount, unloaded: p.metrics.unloadedItemCount, riskScore: p.metrics.riskScore }))), "Scenario Comparison");
  }
  if (carbon) XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet([carbon]), "Carbon Calculation");
  XLSX.writeFile(workbook, `${scenario.scenarioName.replace(/\W+/g, "-")}-LoadOptima.xlsx`);
}

export function downloadTemplate() {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([cargoTemplateHeaders]), "Cargo Template");
  XLSX.writeFile(workbook, "LoadOptima-cargo-template.xlsx");
}

export function downloadPdfReport(scenario: Scenario, selectedPlan?: LoadingPlan, carbon?: CarbonFootprintResult) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("LoadOptima AI Loading Report", 14, 18);
  doc.setFontSize(10);
  doc.text(`Scenario: ${scenario.scenarioName}`, 14, 30);
  doc.text(`Vehicle: ${scenario.vehicle.vehicleName}`, 14, 37);
  if (selectedPlan) {
    doc.text(`Recommended plan: ${selectedPlan.name} | Score: ${selectedPlan.score}/100`, 14, 47);
    doc.text(`Volume utilization: ${pct(selectedPlan.metrics.volumeUtilization)} | Payload utilization: ${pct(selectedPlan.metrics.payloadUtilization)}`, 14, 54);
    doc.text(`Unused volume: ${m3(selectedPlan.metrics.unusedVolumeM3)} | Loaded/Unloaded: ${selectedPlan.metrics.loadedItemCount}/${selectedPlan.metrics.unloadedItemCount}`, 14, 61);
    doc.text("3D loading snapshot: available in interactive web viewer.", 14, 72);
    doc.text("Inefficiency analysis and rule violations:", 14, 84);
    selectedPlan.riskFlags.slice(0, 8).forEach((risk, i) => doc.text(`- ${risk.severity.toUpperCase()}: ${risk.label} - ${risk.description}`, 18, 92 + i * 7));
  }
  if (carbon) {
    doc.text("Carbon footprint summary:", 14, 156);
    doc.text(`Route: ${carbon.routeName} | Distance: ${carbon.distanceKm} km | Vehicles: ${carbon.numberOfVehicles}`, 18, 164);
    doc.text(`Total: ${carbon.totalKgCO2e.toFixed(1)} kgCO2e | Intensity: ${carbon.kgCO2ePerTonKm.toFixed(3)} kgCO2e/ton-km`, 18, 171);
    doc.text(carbon.disclaimer, 14, 190, { maxWidth: 180 });
  }
  doc.save(`${scenario.scenarioName.replace(/\W+/g, "-")}-LoadOptima.pdf`);
}
