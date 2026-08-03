import type { AuctionListItem, AuctionShowResponse, AuctionStatus, AuctionType, TradingStatus } from '@/shared/api'
import type { DeepRequired } from '@/shared/lib/deep-required'

export interface AuctionCardViewModel {
  uuid: string
  cargoNum: string
  aucType: (typeof AuctionType)[keyof typeof AuctionType]
  status: (typeof AuctionStatus)[keyof typeof AuctionStatus]
  tradingStatus: (typeof TradingStatus)[keyof typeof TradingStatus]
  route: { loadCity: string; unloadCity: string; totalStops: number }
  loadDate: string | null
  unloadDate: string | null
  cargo: { name: string; weight: number; volume: number; bodyType: string }
  /** AuctionListItemTradingPrice has no `step` — only the detail DTO does. */
  price: { current: number | null; perKm: number | null }
  hasMyBet: boolean
  primaryAction: PrimaryAction
}

export type PrimaryActionKind = 'place-bet' | 'change-bet' | 'view-bets' | 'disabled'

export interface PrimaryAction {
  kind: PrimaryActionKind
  label: string
}

export type ListAuctionTrading = NonNullable<AuctionListItem['trading']>

/** DeepRequired because almost nothing in AuctionShowResponse is marked `required` past the top level (see shared/lib/deep-required.ts) — the mock always populates it fully. */
export type AuctionDetailData = DeepRequired<AuctionShowResponse>
