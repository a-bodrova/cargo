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

1. If `specs/<feature-slug>.md` already exists, this is a **revision**, not a fresh write — don't overwrite the whole file:
   - Read the existing spec in full first.
   - Ask what specifically is changing or being added, if that isn't already clear from context.
   - Edit only the affected Acceptance Criteria/Edge Cases bullets (add/change/remove) — leave the rest of the file untouched. Regenerating the whole file erases the distinction between what's stable and what actually changed, and makes the diff unreviewable.
   - State plainly, in the response, exactly which bullets changed — that list is what `implement-spec` (or a human) needs to know what to re-check against the existing implementation.
2. If `src/pages/<feature-slug>/` (or the relevant widget/feature slice) already has implementation files:
   - **Fresh spec, code already exists**: warn that writing the spec after the code inverts the SDD order this project follows — still write it if asked to, but say so plainly rather than silently going along with it.
   - **Revision (step 1 above)**: this is the normal case, not a warning-worthy one — say so, and point to running `implement-spec <feature-slug>` next to reconcile the implementation against the changed bullets.
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

`write-spec auctions-list` (spec and implementation already exist, user wants to add sorting) →

- reads `specs/auctions-list.md` in full
- confirms the change: add sorting by `AuctionListRequest.sort` (`start_time`/`price_per_km`/`current_price`, asc/desc)
- adds one new Acceptance Criteria bullet referencing `AuctionListRequest.sort`, leaves every other bullet untouched
- reports: "changed: added one Acceptance Criteria bullet for sorting; everything else in the file is unchanged"
- points to running `implement-spec auctions-list` next
