import type { AuctionListRequest } from '@/shared/api'

import type { AuctionsListSearch } from './filters.schema'

export function buildAuctionListRequest(search: AuctionsListSearch): AuctionListRequest {
  return {
    page: search.page,
    per_page: search.per_page,
    cargo_num: search.cargo_num,
    statuses: search.statuses,
    status: search.status,
    auc_type: search.auc_type,
    load_city: search.load_city,
    unload_city: search.unload_city,
    // ponytail: fixed +03:00 offset, derive from user/org timezone if this ships beyond the demo
    load_date_from: search.load_date_from ? `${search.load_date_from}T00:00:00+03:00` : undefined,
    load_date_to: search.load_date_to ? `${search.load_date_to}T23:59:59+03:00` : undefined,
    is_available: search.is_available,
    is_bidder: search.is_bidder,
    current_price_from: search.current_price_from,
    current_price_to: search.current_price_to,
  }
}
