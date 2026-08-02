---
name: write-spec
description: Scaffold a new specs/<feature>.md file in this project's fixed SDD template (Goal, Scope, Acceptance Criteria, Edge Cases). Use before starting any feature's implementation — the spec must exist and be reviewed before the corresponding pages/widgets/features code is written.
---

# write-spec

Writes one spec file at `specs/<feature-slug>.md`, matching the shape already used by `specs/auctions-list.md`, `specs/auction-detail.md`, and `specs/place-bet.md`.

## Usage

Args (in order, ask for whichever is missing): `<feature-slug> [related-schema-operations]`

- `feature-slug` — kebab-case, matches the eventual `pages/<feature-slug>` slice name (e.g. `auctions-list`, `place-bet`).
- `related-schema-operations` — optional list of OpenAPI `operationId`s this feature touches (e.g. `listAuctions`), used to ground acceptance criteria in real fields/enums instead of vague prose.

## Steps

1. If `specs/<feature-slug>.md` already exists, stop and report — do not overwrite. Ask whether the user meant to revise it instead.
2. If `src/pages/<feature-slug>/` (or the relevant widget/feature slice) already has implementation files, warn that writing the spec after the code inverts the SDD order this project follows — still write it if asked to, but say so plainly rather than silently going along with it.
3. Fill exactly these sections, no more, no less:
   - **Goal** — one or two sentences: what the feature does and why it exists (tie back to the assignment requirement it satisfies).
   - **Scope** — which route(s)/page(s) this covers.
   - **Acceptance Criteria** — a bullet list; every bullet must be checkable against a concrete schema field/enum (`openapi.auctions.v0.json`) or an explicit sentence from the assignment — no unfalsifiable criteria like "works well" or "is user-friendly."
   - **Edge Cases** — a bullet list naming the specific DTO flags/states that change behavior (e.g. `can_set_bet`, `hide_bets_history`, `hide_points_address_and_contacts`, `no_view_cargo_price`, empty/error/loading states, 422 responses) where relevant to this feature.
4. Cross-reference the relevant `operationId`(s) and schema names inline so the spec stays traceable to the schema, not just to memory of a conversation.
5. If this spec was written alongside others from the same intake batch, don't send it straight to implementation — point to `review-specs` first, to cross-check the batch for consistency before anything gets built. For a single standalone spec with no siblings, it's fine to skip straight to step 6.
6. Once the spec (or the batch it's part of, via `review-specs`) is confirmed ready to build, tell the user to start a **new session** and run `implement-spec <feature-slug>` there — that skill turns this file into scoped implementation context instead of the feature being built inside whatever conversation happened to write the spec.

## Example

`write-spec place-bet setBet` →

```
specs/place-bet.md
```
with Goal/Scope/Acceptance Criteria/Edge Cases filled per the bet-form requirements, Acceptance Criteria referencing `SetBetRequest.price`, `trading.can_set_bet`, `trading.price.{min,max,step}`, and Edge Cases covering the Down/Up/FixPrice direction rules and 422 field-error mapping.
