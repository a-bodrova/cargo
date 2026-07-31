// Hand-written today in the exact shape .claude/skills/generate-api's future
// external generator would produce: one createQuery/createInfiniteQuery line
// per query-shaped operation in shared/api. See that skill for how to keep
// this in sync when the schema changes.
import { getAuctionOptions, listAuctionsInfiniteOptions, listAuctionsOptions, listBetsOptions } from '@/shared/api'
import { createInfiniteQuery, createQuery } from '@/shared/lib/wrappers'

export const useGetAuction = createQuery(getAuctionOptions)
export const useListAuctions = createQuery(listAuctionsOptions)
export const useListAuctionsInfinite = createInfiniteQuery(listAuctionsInfiniteOptions)
export const useListBets = createQuery(listBetsOptions)
