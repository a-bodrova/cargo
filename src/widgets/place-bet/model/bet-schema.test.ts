import { describe, expect, it } from 'vitest'

import { AuctionType } from '@/shared/api'

import { createBetSchema } from './bet-schema'

const NO_PRICE = { current: null, step: null, available: null }

describe('createBetSchema', () => {
  it('rejects price <= 0 regardless of auc_type', () => {
    const result = createBetSchema(AuctionType.REQUEST, NO_PRICE).safeParse({ price: 0 })
    expect(result.success).toBe(false)
  })

  describe('Down', () => {
    const price = { current: 10000, step: 500, available: null }

    it('accepts a price at or below current minus step', () => {
      expect(createBetSchema(AuctionType.DOWN, price).safeParse({ price: 9500 }).success).toBe(true)
    })

    it('rejects a price above current minus step', () => {
      expect(createBetSchema(AuctionType.DOWN, price).safeParse({ price: 9600 }).success).toBe(false)
    })

    it('skips the direction check when current or step is null', () => {
      expect(createBetSchema(AuctionType.DOWN, NO_PRICE).safeParse({ price: 1 }).success).toBe(true)
    })
  })

  describe('Up', () => {
    const price = { current: 10500, step: null, available: null }

    it('accepts a price above current', () => {
      expect(createBetSchema(AuctionType.UP, price).safeParse({ price: 11000 }).success).toBe(true)
    })

    it('rejects a price at or below current', () => {
      expect(createBetSchema(AuctionType.UP, price).safeParse({ price: 10500 }).success).toBe(false)
    })

    it('skips the direction check when current is null', () => {
      expect(createBetSchema(AuctionType.UP, NO_PRICE).safeParse({ price: 1 }).success).toBe(true)
    })
  })

  describe('FixPrice', () => {
    const price = { current: 25000, step: null, available: 25000 }

    it('accepts a price equal to available', () => {
      expect(createBetSchema(AuctionType.FIX_PRICE, price).safeParse({ price: 25000 }).success).toBe(true)
    })

    it('rejects a price different from available', () => {
      expect(createBetSchema(AuctionType.FIX_PRICE, price).safeParse({ price: 24000 }).success).toBe(false)
    })

    it('skips the direction check when available is null', () => {
      expect(createBetSchema(AuctionType.FIX_PRICE, NO_PRICE).safeParse({ price: 1 }).success).toBe(true)
    })
  })

  describe('Request', () => {
    it('has no direction check, only price > 0', () => {
      const price = { current: 5000, step: 100, available: null }
      expect(createBetSchema(AuctionType.REQUEST, price).safeParse({ price: 1 }).success).toBe(true)
    })
  })
})
