import { getAuctionOptions } from '@/shared/api'
import type { AuctionListRequest, AuctionShowResponse } from '@/shared/api'
import type { DeepRequired } from '@/shared/lib/deep-required'
import { queryClient } from '@/shared/lib/query-client'
import { useGetAuction, useListAuctions } from '@/shared/lib/api/generated'

import { isBetsHistoryHidden } from '../model/bets-history-visibility'
import { mapAuctionToCard } from '../model/map-auction'

/** Fired on card hover/pointer-intent so the detail page's query is already cached by the time the user clicks. */
export function prefetchAuctionDetail(auctionUuid: string) {
  void queryClient.prefetchQuery(getAuctionOptions({ path: { auctionUuid } }))
}

export function useAuctionsList(request: AuctionListRequest) {
  const query = useListAuctions({ body: request })

  return {
    items: query.data?.data?.map(mapAuctionToCard) ?? [],
    meta: query.data?.meta,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

/** Long enough that clicking through from a hover-prefetched card (prefetchAuctionDetail) reuses the warm cache instead of the global staleTime:0 default triggering an immediate background refetch on mount. */
const DETAIL_STALE_TIME_MS = 30_000

export function useAuctionDetail(auctionUuid: string) {
  const query = useGetAuction({ path: { auctionUuid } }, { staleTime: DETAIL_STALE_TIME_MS })
  // query.data's fields are typed as required, but that's only the OpenAPI contract — a
  // dev-server hiccup (e.g. HMR reconnecting mid-request) can still resolve the query
  // successfully with a body that doesn't match it. Guard the one field every block reads
  // first, so a malformed response degrades to the error state instead of throwing.
  const data = query.data?.trading != null ? (query.data as DeepRequired<AuctionShowResponse>) : undefined
  const malformed = query.isSuccess && data == null

  return {
    data,
    isPending: query.isPending,
    isError: query.isError || malformed,
    error: query.error,
    refetch: query.refetch,
    hideBetsHistory: data != null && isBetsHistoryHidden(data),
  }
}
