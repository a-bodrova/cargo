// Hand-written today in the exact shape .claude/skills/generate-api's future
// external generator would produce: one createQuery line per query-shaped
// operation in shared/api. See that skill for how to keep this in sync when
// the schema changes.
import { getAuctionOptions, listAuctionsOptions, listBetsOptions } from '@/shared/api'
import { createQuery } from '@/shared/lib/wrappers'

export const useGetAuction = createQuery(getAuctionOptions)
export const useListAuctions = createQuery(listAuctionsOptions)
export const useListBets = createQuery(listBetsOptions)
