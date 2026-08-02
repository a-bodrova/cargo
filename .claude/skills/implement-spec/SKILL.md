---
name: implement-spec
description: Bootstrap implementation of one feature from its specs/<slug>.md — resolves the OpenAPI operations it references, points to the nearest existing FSD slice as a pattern reference, and seeds a task list, so a fresh session starts with exactly the context that feature needs and nothing carried over from unrelated prior work. Use as the first message of a new session when implementing a feature that already has a written, reviewed spec.
---

# implement-spec

Companion to `write-spec`: that skill produces `specs/<slug>.md`; this one turns it into implementation context for a **new** session, so a long-running conversation doesn't accumulate unrelated features' history that has to be waded through to build the next one.

## Usage

Args: `<feature-slug>`

- Run this as the first substantive step of a new session — not partway through one already carrying other features' context. If the current session already has unrelated work in it, say so and suggest starting fresh instead of proceeding here.
- This skill never creates, switches, or otherwise touches git branches — that stays a manual, user-driven step (see the project's standing "never change git state" rule). It assumes the working tree is already checked out on the right branch for `<feature-slug>` when it starts. Confirm that assumption with a plain `git branch --show-current` read (read-only) and surface the result — if the current branch name doesn't obviously match the feature (e.g. still on `main`, or on a different feature's branch), stop and ask the user to check out the right branch before continuing, rather than guessing or creating one.

## Steps

1. Require `specs/<feature-slug>.md` to exist; if missing, stop and point to `write-spec` instead — implementation must not start ahead of a reviewed spec.
2. Extract every `operationId`/schema name the spec references (its Acceptance Criteria and Edge Cases sections cross-reference them by design) and pull the matching fragments out of `openapi.auctions.v0.json` — quote them inline rather than telling the session to go read the whole file.
3. Identify the nearest already-implemented sibling slice (same layer, adjacent domain — e.g. `auctions-list` for `auction-detail`) and name it as the pattern to match for query/mapping/UI conventions, instead of re-deriving conventions from scratch. If none exists yet (this is the first feature in its layer), say so explicitly instead of forcing a comparison — don't invent a pattern reference that isn't there.
4. Check whether `src/pages/<feature-slug>/` (or the relevant widget/feature slice) already has implementation files:
   - **Already implemented**: creating build tasks is nonsense — instead verify each Acceptance Criteria/Edge Case bullet against the actual code and report a checklist (pass/fail + file:line evidence). Flag any bullet that's satisfied only implicitly (e.g. by a type happening to omit a field) rather than by an explicit check tied to the condition the spec names — that's a finding to raise, not a pass. Skip steps 5-6 below in this case.
   - **Not implemented yet**: continue to step 5.
5. **Estimate the rough token cost of implementing this feature, capped at 150k.** Base the estimate on: number of Acceptance Criteria + Edge Case bullets in the spec, whether step 3 found a pattern-reference sibling (no sibling costs noticeably more — conventions have to be derived from scratch), whether new schema operations need `generate-api` wiring, and whether tests/browser verification are in scope. State the number and the reasoning behind it plainly — this is a heuristic, not a guarantee.
   - **≤150k**: proceed as a single pass — break the spec's Acceptance Criteria + Edge Cases into a `TaskCreate` list scoped to this feature, one task per bullet group (not per file), and implement directly in this session.
   - **>150k**: do not implement the whole feature here. Split it into smaller sub-units ("stories") sized to plausibly land under the cap, and dispatch each as its own subagent (`Agent` tool) — this session becomes that subagent's parent instead of doing the implementation itself. Apply this same estimate-then-decide test recursively inside each dispatched child: if a child's own estimate is still over 150k, it decomposes further and dispatches its own children — to whatever depth the cap forces, not a fixed number of levels.
   - Hierarchy convention across the pipeline: the root agent owns the **project**, an agent it delegates to owns an **epic**, that agent's own child owns a **story**, and so on recursively. By default each parent only receives its children's summarized completion reports, not their full implementation detail — the "root stays thin" principle applies at every level, not just at the top. This is a default, not a wall: a completed child agent doesn't disappear, and a parent that later needs a specific detail resumes that exact child directly (`SendMessage` to its agent id) rather than re-deriving the answer itself or dragging the child's full context into its own upfront "just in case."
6. State the FSD import rule and the two other standing skills (`add-fsd-slice` for scaffolding, `generate-api` if the feature needs new operations wired) so they're available without rediscovery.
7. Do not import or summarize any other spec's/feature's history. If the session genuinely needs cross-feature context (e.g. a shared entity), name the specific file to read — not "everything about the project so far."

## Example

`implement-spec auction-detail` →

- confirms `specs/auction-detail.md` exists
- pulls the `getAuction` and `listBets` schema fragments from `openapi.auctions.v0.json`
- points at `entities/auction` and `pages/auctions-list` as the pattern reference
- estimates ~90k (4 AC bullets, has a pattern reference, no new schema ops beyond `getAuction`/`listBets`, includes tests) — under the 150k cap, implements directly
- creates tasks: "detail route + query", "bets tab", "reuse primary-action logic from entities/auction", "loading/error/empty states"
- reminds: FSD layering rule, `add-fsd-slice pages auction-detail`, `generate-api` if `getAuction`/`listBets` aren't wired yet

A hypothetical large feature estimating over the cap (e.g. a full order-management page with 20+ Acceptance Criteria bullets, no pattern reference, several new schema operations) → doesn't implement inline. Splits into stories (e.g. "list view", "detail drawer", "bulk actions"), dispatches one subagent per story; any story whose own estimate is still >150k splits again the same way, one level deeper.

`implement-spec auctions-list` (already built, first feature in the project) →

- confirms `specs/auctions-list.md` exists
- pulls `listAuctions`/`getAuction` fragments
- no sibling slice to point to — says so, doesn't invent one
- `pages/auctions-list` already has implementation files → produces a pass/fail checklist against Acceptance Criteria/Edge Cases instead of build tasks, and flags any criterion satisfied only by accident (e.g. a field the type happens not to expose) rather than by an explicit check
