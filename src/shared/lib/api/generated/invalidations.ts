// Hand-written today, same shape the future generator would produce — see
// .claude/skills/generate-api. invalidateListAuctions also invalidates the
// infinite-query cache entries: TanStack Query's default partial key
// matching treats the extra `_infinite`/`body` fields on the infinite key
// as a superset of this plain key, so one invalidator covers both.
import { getAuctionOptions, listAuctionsOptions, listBetsOptions } from '@/shared/api'
import { invalidateQuery } from '@/shared/lib/wrappers'

export const invalidateGetAuction = invalidateQuery(getAuctionOptions)
export const invalidateListAuctions = invalidateQuery(listAuctionsOptions)
export const invalidateListBets = invalidateQuery(listBetsOptions)
