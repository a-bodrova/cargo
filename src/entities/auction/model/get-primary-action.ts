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
