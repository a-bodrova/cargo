import { z } from 'zod'

import { AuctionType, TradingStatus } from '@/shared/api'
import { arraySearchParam } from '@/shared/lib/zod-search-params'

const AUC_TYPE_VALUES = [AuctionType.REQUEST, AuctionType.UP, AuctionType.DOWN, AuctionType.FIX_PRICE] as const
const TRADING_STATUS_VALUES = [
  TradingStatus.NOT_PARTICIPATING,
  TradingStatus.LEADING,
  TradingStatus.LOSING,
  TradingStatus.WINNER,
  TradingStatus.CONFIRMED,
  TradingStatus.ON_PENDING,
  TradingStatus.CHOOSING_WINNER,
  TradingStatus.ACCEPTED,
] as const

/**
 * Mirrors AuctionListRequest field-for-field (see openapi.auctions.v0.json)
 * so build-request.ts is close to a pass-through. Every optional field uses
 * `.catch(undefined)` and page/per_page use `.catch()` with a real default —
 * a malformed query string falls back instead of crashing the route.
 */
export const auctionsListSearchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  per_page: z.coerce.number().int().min(1).max(100).catch(20),
  cargo_num: z.string().trim().min(1).optional().catch(undefined),
  statuses: arraySearchParam(z.coerce.number().int().min(1).max(8)).optional().catch(undefined),
  status: arraySearchParam(z.enum(TRADING_STATUS_VALUES)).optional().catch(undefined),
  auc_type: arraySearchParam(z.enum(AUC_TYPE_VALUES)).optional().catch(undefined),
  load_city: z.string().optional().catch(undefined),
  unload_city: z.string().optional().catch(undefined),
  load_date_from: z.string().date().optional().catch(undefined),
  load_date_to: z.string().date().optional().catch(undefined),
  is_available: z.coerce.boolean().optional().catch(undefined),
  is_bidder: z.coerce.boolean().optional().catch(undefined),
  current_price_from: z.coerce.number().min(0).optional().catch(undefined),
  current_price_to: z.coerce.number().min(0).optional().catch(undefined),
})

export type AuctionsListSearch = z.infer<typeof auctionsListSearchSchema>
