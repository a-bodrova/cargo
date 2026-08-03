import type { BetItem } from '@/shared/api'
import type { DeepRequired } from '@/shared/lib/deep-required'
import { useListBets } from '@/shared/lib/api/generated'

export function useAuctionBets(auctionUuid: string, all: boolean) {
  const query = useListBets({ path: { auctionUuid }, query: { all } })

  return {
    items: (query.data?.bets ?? []) as DeepRequired<BetItem>[],
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
