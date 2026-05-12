import { CargoItem, Placement } from "@/types/domain";

export const cm3ToM3 = (value: number) => value / 1_000_000;
export const volumeM3 = (l: number, w: number, h: number) => cm3ToM3(l * w * h);
export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
export const pct = (value: number) => `${Math.round(value * 100)}%`;
export const kg = (value: number) => `${Math.round(value).toLocaleString()} kg`;
export const m3 = (value: number) => `${value.toFixed(1)} m³`;

export function expandCargo(items: CargoItem[]): CargoItem[] {
  return items.flatMap((item) =>
    Array.from({ length: Math.max(0, item.quantity) }, (_, index) => ({ ...item, id: `${item.id}-${index + 1}`, quantity: 1 }))
  );
}

export function validateCargoItem(item: CargoItem): string[] {
  const errors: string[] = [];
  if (!item.itemCode.trim()) errors.push("Item code is required.");
  if (item.lengthCm <= 0 || item.widthCm <= 0 || item.heightCm <= 0) errors.push("Dimensions must be greater than zero.");
  if (item.weightKg <= 0) errors.push("Weight must be greater than zero.");
  if (item.quantity <= 0) errors.push("Quantity must be greater than zero.");
  if (!item.stackable && item.maxStackLevel > 1) errors.push("Non-stackable cargo should have max stack level of 1.");
  return errors;
}

export function isOverlapping(a: Placement, b: Placement) {
  return !(
    a.x + a.lengthCm <= b.x ||
    b.x + b.lengthCm <= a.x ||
    a.y + a.widthCm <= b.y ||
    b.y + b.widthCm <= a.y ||
    a.z + a.heightCm <= b.z ||
    b.z + b.heightCm <= a.z
  );
}
