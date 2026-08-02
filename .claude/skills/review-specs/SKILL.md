---
name: review-specs
description: Cross-checks a set of specs/<slug>.md files against each other for consistency — shared entities/enums named the same way, no contradicting assumptions, no acceptance criteria silently dropped or duplicated — before any of them go to implement-spec. Runs after write-spec has produced the feature list's specs and before the user gives the go-ahead to start implementation. Does not rewrite spec content itself beyond trivial fixes; mainly reports and asks.
---

# review-specs

Third stage of the pipeline: `intake-requirements` → `write-spec` (one dispatch per feature) → **review-specs** → explicit user confirmation → `implement-spec` (one dispatch per feature, in dependency order). This is the one gate between "specs exist" and "code gets written."

## Usage

Args: `[feature-slug ...]` — optional list of specs to review together. If omitted, review every file under `specs/*.md`.

## Steps

1. Read every spec in scope in full before comparing anything — partial reads produce false conflicts.
2. Check cross-spec consistency, not per-spec correctness (that's `write-spec`'s job, already done there):
   - Same entity/DTO/enum referenced in more than one spec → same field names, same enum values, same `operationId`/schema name cited the same way. A mismatch here is a real defect, not style.
   - Shared UI/behavioral patterns (primary-action logic, filter-sync convention, pagination shape) → referenced consistently, not silently reinvented per feature.
   - Dependency direction: if spec B assumes something spec A's feature produces (an entity, a shared component), confirm A's spec actually commits to producing it in a form B can use — not just "probably will."
   - Scope: no Acceptance Criteria duplicated verbatim across two specs (unclear ownership), and nothing from the original feature list silently missing from every spec (a dropped requirement).
3. For anything found: a real semantic disagreement (e.g. two specs assuming different pagination page sizes) — don't resolve it yourself. Name the conflict, name the specs involved, and ask the user which one is right. Trivial drift you're confident about (e.g. inconsistent casing of the same enum value) can be fixed directly across the affected spec files — say what you changed and where.
4. Produce a short report: one line per spec pair checked, PASS or the specific conflict found — not a restatement of each spec's contents.
5. End with an explicit go/no-go: if every conflict is resolved, say so and ask for confirmation to move to implementation. If issues remain open, list them and don't recommend proceeding.
6. Never dispatch `implement-spec` yourself from inside this skill — that confirmation is a separate, explicit step the user gives after seeing the report.

## Example

`review-specs auctions-list auction-detail place-bet` →

- reads all three specs in full
- finds: `place-bet`'s spec assumes `entities/bet` already exports a `BetStatusBadge`, but `auction-detail`'s spec never commits to creating one → flags it, asks whether `auction-detail` should own it or `place-bet` should
- finds: both `auction-detail` and `place-bet` independently describe the same "insufficient step" 422 mapping with slightly different wording → confirms they agree on substance, notes it's fine (duplication with matching content isn't a conflict)
- fixes directly: `place-bet`'s spec spells the enum `Fix_Price`, the schema and every other spec spell it `FixPrice` → corrects the typo in `place-bet`'s spec, says so
- reports: 2/3 checks pass, 1 open question (`BetStatusBadge` ownership) — recommends resolving that before confirming implementation
