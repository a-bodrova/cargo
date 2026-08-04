import { describe, expect, it } from 'vitest'

import { auctionsListSearchSchema } from './filters.schema'

describe('auctionsListSearchSchema', () => {
  it('applies defaults when the query string is empty', () => {
    const result = auctionsListSearchSchema.parse({})
    expect(result).toEqual({ page: 1, per_page: 20 })
  })

  it('falls back to defaults instead of throwing on garbage input', () => {
    const result = auctionsListSearchSchema.parse({ page: 'abc', per_page: 'nope', current_price_from: 'x' })
    expect(result.page).toBe(1)
    expect(result.per_page).toBe(20)
    expect(result.current_price_from).toBeUndefined()
  })

  it('coerces numeric and boolean search params from URL strings', () => {
    const result = auctionsListSearchSchema.parse({ page: '2', is_available: 'true', current_price_from: '1000' })
    expect(result.page).toBe(2)
    expect(result.is_available).toBe(true)
    expect(result.current_price_from).toBe(1000)
  })

  it('drops an out-of-range enum value in auc_type instead of failing the whole object', () => {
    const result = auctionsListSearchSchema.parse({ auc_type: ['Up', 'NotARealType'] })
    expect(result.auc_type).toBeUndefined()
  })
})
