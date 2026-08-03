import { describe, expect, it } from 'vitest'

import { isBetsHistoryHidden } from './bets-history-visibility'
import { getDetailPrimaryAction } from './get-primary-action'

describe('getDetailPrimaryAction', () => {
  it('offers to place a bet when there is none yet and betting is allowed', () => {
    expect(getDetailPrimaryAction({ can_set_bet: true, your: { bet: false } }).kind).toBe('place-bet')
  })

  it('offers to change the bet when one already exists and betting is allowed', () => {
    expect(getDetailPrimaryAction({ can_set_bet: true, your: { bet: true } }).kind).toBe('change-bet')
  })

  it('disables regardless of an existing bet when betting is not allowed', () => {
    expect(getDetailPrimaryAction({ can_set_bet: false, your: { bet: true } }).kind).toBe('disabled')
    expect(getDetailPrimaryAction({ can_set_bet: false, your: { bet: false } }).kind).toBe('disabled')
  })
})

describe('isBetsHistoryHidden', () => {
  it('is hidden when only the root flag is true', () => {
    expect(isBetsHistoryHidden({ hide_bets_history: true, trading: { hide_bets_history: false } })).toBe(true)
  })

  it('is hidden when only the trading flag is true', () => {
    expect(isBetsHistoryHidden({ hide_bets_history: false, trading: { hide_bets_history: true } })).toBe(true)
  })

  it('is visible when both flags are false', () => {
    expect(isBetsHistoryHidden({ hide_bets_history: false, trading: { hide_bets_history: false } })).toBe(false)
  })
})
