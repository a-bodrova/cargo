// Hand-written today, same shape the future generator would produce — see
// .claude/skills/generate-api. Calling invalidateListAuctions() with no
// options invalidates every cached list query regardless of filters:
// TanStack Query's partial key matching only checks the properties we did
// specify (just `_id`), so any `body` on the cached key still matches.
import { getAuctionOptions, listAuctionsOptions, listBetsOptions } from '@/shared/api'
import { invalidateQuery } from '@/shared/lib/wrappers'

export const invalidateGetAuction = invalidateQuery(getAuctionOptions)
export const invalidateListAuctions = invalidateQuery(listAuctionsOptions)
export const invalidateListBets = invalidateQuery(listBetsOptions)
