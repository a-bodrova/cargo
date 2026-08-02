---
name: intake-requirements
description: First step of the SDD pipeline, before any spec gets written. Requires a concrete backend contract (OpenAPI/Swagger/JSON schema) and a Figma design link before proceeding, reads the raw brief (ФТТ/ТЗ and ЕЗ if present) in full, asks clarifying questions to pin down ambiguous business requirements, proposes implementation options with trade-offs, and decomposes the confirmed scope into a feature list ready for write-spec. Use as the first message of a new session when starting a new SDD pipeline from a raw requirements brief, before any specs/*.md exist for it.
---

# intake-requirements

First stage of the pipeline: `intake-requirements` → `write-spec` (one dispatch per feature) → consistency review → `implement-spec` (one dispatch per feature, on its own branch). This skill only covers the first stage — it never writes a spec file itself.

## Steps

1. **Gate on two required inputs** before doing anything else:
   - A machine-readable backend contract (OpenAPI/Swagger, YAML or JSON, or an equivalent typed schema). `write-spec` requires every Acceptance Criteria bullet in this project to cross-reference a real `operationId`/schema field (see `specs/auctions-list.md` for the pattern); that discipline only holds if the contract exists before specs get written, not bolted on after.
   - A Figma link for the feature's UI. Business prose describes behavior, not layout/spacing/breakpoints/component states — without the design, Acceptance Criteria end up guessing at UI details that Figma already answers precisely.
   - If either is missing, stop and ask for it explicitly — do not proceed on the brief's prose descriptions alone, for data shape or for UI.
   - If a contract exists but looks partial or stale against what the brief describes (e.g. the brief clearly needs an operation the contract doesn't have), say so plainly and ask whether to proceed with the gap noted or wait for an updated contract — don't silently paper over it with assumed field names.
2. Once a Figma link is provided, **load the `figma-design-to-code` skill before touching any Figma MCP tool** (it's a mandatory prerequisite for `get_design_context` — never call that tool directly) and pull the design context for the relevant frames: components/variants used, spacing/breakpoints, and any states (empty/error/loading, disabled) the design shows that the brief's prose doesn't mention. Note in the intake output which Acceptance Criteria came from the contract, which came from Figma, and which came from the brief's prose — keeps every criterion traceable to its source instead of blurring into "the AI decided this."
   - If the Figma MCP connector isn't authorized in the current environment, say so plainly and ask the user to authorize it (via their client's connector settings) rather than guessing at the design or skipping this input silently.
3. Read the ФТТ in full — and the ЕЗ, if one was provided — before asking anything. Don't ask about something the document, contract, or Figma file already answers.
4. Ask clarifying questions for every business requirement that's ambiguous, underspecified, or has more than one reasonable reading, and that neither the contract nor Figma resolves (edge cases the brief doesn't mention, roles/permissions it assumes without stating, behavior on validation failure, etc.). One batched round of questions — not a back-and-forth one at a time.
5. Once requirements are clear, propose implementation options wherever a real choice exists (e.g. client-only filter state vs URL-synced, one form vs a wizard), each with its trade-off named plainly — mirror how choices got resolved elsewhere in this project (Button size variants, CI, Docker): state the trade-off, let the user decide, don't silently pick for them.
6. After the user picks an approach, decompose the confirmed scope into a feature list at the granularity `write-spec`/`add-fsd-slice` already expect (page/widget-sized slices, kebab-case slugs). This list is what gets handed to `write-spec`, one dispatch per feature.
7. Do not write any spec file yourself — that's `write-spec`'s job, one call per feature-slug from the list this skill produces.

## Example

`intake-requirements` (ФТТ.pdf attached, no ЕЗ, no contract, no Figma link) →

- checks for an OpenAPI/Swagger file and a Figma link — neither found → stops, asks for both before reading further
- (once both provided) loads `figma-design-to-code`, pulls design context for the relevant frames; reads the ФТТ in full; asks one batched round of clarifying questions limited to what neither the contract nor the design answers (auth scope, empty-state copy wording)
- proposes: URL-synced filter state (matches this project's `auctions-list`) vs local-only state — recommends URL-synced, names the trade-off (shareable/bookmarkable links vs a bit more schema work)
- produces the feature list: `auctions-list`, `auction-detail`, `place-bet`
- hands off: run `write-spec auctions-list listAuctions`, `write-spec auction-detail getAuction`, `write-spec place-bet setBet` — one per feature, sequentially
