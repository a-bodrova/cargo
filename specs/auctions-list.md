# Auctions List

## Goal

Let a carrier browse and filter cargo auctions they can bid on, so they can find a relevant load without scanning the whole marketplace. Satisfies the assignment's "список аукционов" requirement.

## Scope

- Route `/auctions` (`pages/auctions-list`).
- Backed by `POST /auctions/list` (`operationId: listAuctions`).

## Acceptance Criteria

- Data loads via TanStack Query against `listAuctions`; request body matches `AuctionListRequest` — `page`, `per_page` at minimum.
- Pagination reflects `AuctionListResponseBase.meta` (`current_page`, `last_page`, `per_page`, `total`); page changes update `AuctionListRequest.page`.
- Three distinct visual states: loading (skeleton), empty (`meta.total === 0`), error (query error, with a retry action).
- Filters, all mapped 1:1 onto `AuctionListRequest` fields and synced to the URL search params:
  - `cargo_num` (string)
  - `status` (array, `TradingStatus` enum incl. list-only values `OnPending`/`ChoosingWinner`/`Accepted`) and/or `statuses` (numeric `AuctionStatus` codes)
  - `auc_type` (array, `Request`/`Up`/`Down`/`FixPrice`)
  - `load_city` / `unload_city` (string, drawn from the mock city dictionary — `shared/config/cities.ts`)
  - `load_date_from` / `load_date_to` (date range)
  - `is_available` (boolean)
  - `is_bidder` (boolean)
  - `current_price_from` / `current_price_to` (number range)
- Search params are parsed and validated with a Zod schema; every field falls back to a safe default (`.catch()`) instead of throwing on a malformed URL.
- Hovering/pointer-intent on a card prefetches that auction's detail query (`getAuction`) before the user clicks.
- Layout adapts between desktop (filters panel) and mobile (filters drawer).
- Each `AuctionListItem` card shows: `main.cargo_num`, `main.auc_type`, `trading.status`, `trading.status_mobile`, `route.load`→`route.unload`, load/unload dates, `cargo.{name,weight,volume,body_type}`, `trading.price.current`, `main.price_per_km`, `trading.your.bet` (has-my-bet flag), and a primary action derived from `trading.can_set_bet` × `trading.your.bet` × `trading.status_mobile` (Сделать ставку / Изменить ставку / Смотреть ставки / disabled).

## Edge Cases

- `trading.can_set_bet === false` → primary action is disabled, not hidden.
- `trading.hide_points_address_and_contacts === true` → card must not leak load/unload address beyond city name.
- `trading.price` is `null` (e.g. `Request`-type auctions before pricing exists) → price block shows a neutral placeholder, not `0` or a crash.
- `per_page` beyond the schema's practical range → clamp client-side before sending, per the search-params schema's fallback, not left to the mock to silently ignore.
- Zero results for a valid filter combination → empty state, not an error state.
- Malformed/garbage query string (e.g. `?page=abc&is_available=maybe`) → falls back to defaults, page still renders.
