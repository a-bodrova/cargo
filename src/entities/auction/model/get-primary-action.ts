import type { AuctionShowResponse } from '@/shared/api'

import type { ListAuctionTrading, PrimaryAction } from './types'

/**
 * 2x2 decision table, derived from the seed data's documented expectations
 * (shared/mocks/db/seed.ts): whether the user has an active bet crossed with
 * whether they're currently allowed to bid.
 */
export function getPrimaryAction(trading: ListAuctionTrading): PrimaryAction {
  const hasMyBet = trading.your?.bet === true

  if (hasMyBet) {
    return trading.can_set_bet ? { kind: 'change-bet', label: 'Изменить ставку' } : { kind: 'view-bets', label: 'Смотреть ставки' }
  }

  return trading.can_set_bet ? { kind: 'place-bet', label: 'Сделать ставку' } : { kind: 'disabled', label: 'Ставка недоступна' }
}

export type DetailAuctionTrading = NonNullable<AuctionShowResponse['trading']>

/**
 * Detail page's CTA collapses the list's 4-state action to 3 — the bets
 * history is already on this page, so there's no separate 'view-bets' state;
 * can_set_bet===false is just disabled regardless of your.bet.
 */
export function getDetailPrimaryAction(trading: DetailAuctionTrading): PrimaryAction {
  if (!trading.can_set_bet) return { kind: 'disabled', label: 'Ставка недоступна' }
  return trading.your?.bet === true ? { kind: 'change-bet', label: 'Изменить ставку' } : { kind: 'place-bet', label: 'Сделать ставку' }
}
