---
name: add-fsd-slice
description: Scaffold a new Feature-Sliced Design slice (entity, feature, widget, or page) under src/ with only the segments it actually needs and an index.ts barrel. Use when adding a new domain concept, user-facing feature, widget composition, or route-backing page to this project.
---

# add-fsd-slice

Scaffolds one new slice under `src/{entities,features,widgets,pages}/<slice-name>/`, matching the conventions already established in this repo (see `entities/auction`, `entities/bet` once they exist as the reference examples).

## Usage

Args (in order, ask for whichever is missing): `<layer> <slice-name> [segments]`

- `layer` — one of `entities`, `features`, `widgets`, `pages`.
- `slice-name` — kebab-case (e.g. `auctions-filters`, `auction-bets`).
- `segments` — optional subset of `ui`, `model`, `api`, `lib`. If omitted, infer from layer:
  - `entities` → `ui/`, `model/` (add `api/` only if the entity has its own queries)
  - `features` → `ui/`, `model/` (add `api/` only if the feature has its own mutation)
  - `widgets` → `ui/` only, unless the task clearly needs local state (`model/`)
  - `pages` → `ui/` only

## Steps

1. If `src/<layer>/<slice-name>/` already exists, stop and report — do not overwrite. Ask the user whether they meant to extend the existing slice instead.
2. Create only the requested/inferred segment folders. Do not create empty placeholder folders for segments that have no content yet — a segment folder is created the moment its first file is written into it, not before.
3. Write `index.ts` in the slice root re-exporting only the slice's public surface (the components/hooks/schemas other layers are meant to import) — never re-export internal helpers.
4. Component files use standard `*.tsx` naming — never `*.component.tsx` (see AI_USAGE.md for why that suffix was rejected).
5. Print a one-line reminder of the FSD import rule before finishing: **a slice may only import from strictly lower layers (`app > pages > widgets > features > entities > shared`) plus `shared` — never sideways (entity → entity, feature → feature) and never upward.**

## Example

`add-fsd-slice entities bet` →
```
src/entities/bet/
  ui/BetRow.tsx
  ui/BetStatusBadge.tsx
  model/types.ts
  model/map-bet.ts
  api/queries.ts
  api/query-keys.ts
  index.ts
```
