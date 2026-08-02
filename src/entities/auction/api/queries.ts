import { getAuctionOptions } from '@/shared/api'
import type { AuctionListRequest } from '@/shared/api'
import { queryClient } from '@/shared/lib/query-client'
import { useListAuctions } from '@/shared/lib/api/generated'

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
