import { NextResponse } from "next/server";
import { calculateCarbon } from "@/lib/carbon";
import { LoadingPlan, VehicleType } from "@/types/domain";

export async function POST(request: Request) {
  const body = (await request.json()) as { plan?: LoadingPlan; vehicle?: VehicleType; distanceKm?: number; returnTripAssumption?: boolean; routeName?: string };
  if (!body.plan || !body.vehicle) return NextResponse.json({ error: "plan and vehicle are required" }, { status: 400 });
  return NextResponse.json({ carbon: calculateCarbon({ plan: body.plan, vehicle: body.vehicle, distanceKm: body.distanceKm ?? 0, returnTripAssumption: Boolean(body.returnTripAssumption), routeName: body.routeName ?? "Route" }) });
}
