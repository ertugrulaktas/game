import { NextResponse } from "next/server";
import { optimizeLoading } from "@/lib/optimizer";
import { CargoItem, VehicleType } from "@/types/domain";

export async function POST(request: Request) {
  const body = (await request.json()) as { cargoItems?: CargoItem[]; vehicle?: VehicleType };
  if (!body.cargoItems?.length || !body.vehicle) return NextResponse.json({ error: "cargoItems and vehicle are required" }, { status: 400 });
  return NextResponse.json({ plans: optimizeLoading(body.cargoItems, body.vehicle) });
}
