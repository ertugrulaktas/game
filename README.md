# LoadOptima AI

LoadOptima AI / Akıllı Yükleme Optimizasyon Platformu is a polished MVP for AI-supported loading optimization, 3D truck/container loading simulation, scenario comparison, and carbon footprint estimation.

## What is included

- Next.js + TypeScript + Tailwind CSS SaaS interface.
- Demo dashboard with executive KPIs and optimization history chart.
- Manual cargo table with validation, duplicate/delete rows, and Excel/CSV import.
- Downloadable Excel cargo template.
- Vehicle/container presets: 20 ft, 40 ft, 40 ft high cube, semi-trailer, box truck, lorry, van, and custom vehicle.
- Heuristic 3D bin-packing engine for mixed cuboid cargo.
- At least 3 generated plan alternatives using different sort strategies.
- 3D loading viewer with transparent vehicle envelope, colored cargo cuboids, hover labels, category visibility toggles, top/side/rear/3D views, and center-of-gravity marker.
- Scenario comparison with utilization, payload, unused volume, loaded/unloaded count, estimated vehicles, risk, and recommendation tags.
- Carbon footprint estimate with distance, vehicle emission factor, utilization penalty, return trip assumption, and sustainability disclaimer.
- Excel and PDF report export.
- Browser-local scenario saving plus a PostgreSQL-compatible Prisma schema for later database persistence.
- API routes for optimization and carbon calculation.

## Domain coverage

The MVP supports mixed cargo with dimensions, weight, quantity, stackability, max stack level, fragility, rotation permission, hazardous flag, loading priority, delivery sequence, palletization, color, and notes. It detects inefficiencies including empty volume, unused floor, payload risk, poor weight distribution, unloaded items, rule warnings, excessive vehicle count, and center-of-gravity risk.

The current geometry layer uses boxes/cuboids. The placement and visualization modules are intentionally separated so later CAD-like importers for STEP, STL, OBJ, DXF, or GLTF can convert geometry into bounding boxes and collision meshes.

## Heuristic approach

The optimizer is an extensible MVP heuristic, not a guaranteed mathematical optimum. It:

1. Expands cargo quantities into loadable units.
2. Runs multiple sort strategies: largest volume first, heaviest first, longest dimension first, delivery sequence priority, and stackability group first.
3. Generates candidate extreme points from placed boxes.
4. Tests allowed rotations, vehicle boundaries, collisions, payload, support area, stackability, max stack level, fragile/heavy-over-fragile rules, and hazardous soft warnings.
5. Calculates volume utilization, floor utilization, payload utilization, unused volume, unloaded units, center of gravity, weight balance, rule compliance, sequence efficiency, risk score, constraint mode, and estimated vehicles needed.
6. Scores each plan using: volume utilization 30%, payload utilization 20%, stability/weight distribution 20%, rule compliance 20%, and loading sequence efficiency 10%.

## Demo scenarios

- Fertilizer export load: granular fertilizer bags on pallets with different pallet sizes, mixed weights, quantities, and a standard semi-trailer.
- Mixed industrial boxes: variable dimensions, fragile cabinets, spare-part cartons, machinery, hazardous maintenance chemicals, and a 40 ft container.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Checks

```bash
npm run typecheck
npm run build
```

## Project structure

- `src/app/page.tsx` — main composed product screens.
- `src/components/` — dashboard, cargo table, vehicle selector, results, 3D viewer, comparison, carbon report, saved scenarios, settings.
- `src/lib/optimizer.ts` — loading heuristic and scoring model.
- `src/lib/carbon.ts` — carbon footprint calculation.
- `src/lib/exporters.ts` — XLSX import/template/export and PDF export.
- `src/lib/demo-data.ts` — vehicle presets and demo cargo.
- `src/store/useLoadOptimaStore.ts` — local scenario state and persistence.
- `src/types/domain.ts` — MVP domain entities.
- `prisma/schema.prisma` — future database schema.
