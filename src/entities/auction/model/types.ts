import type { AuctionListItem, AuctionStatus, AuctionType, TradingStatus } from '@/shared/api'

export interface AuctionCardViewModel {
  uuid: string
  cargoNum: string
  aucType: (typeof AuctionType)[keyof typeof AuctionType]
  status: (typeof AuctionStatus)[keyof typeof AuctionStatus]
  tradingStatus: (typeof TradingStatus)[keyof typeof TradingStatus]
  route: { loadCity: string; unloadCity: string }
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
