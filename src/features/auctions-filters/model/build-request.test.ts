import { describe, expect, it } from 'vitest'

import { buildAuctionListRequest } from './build-request'

describe('buildAuctionListRequest', () => {
  it('passes page/per_page and omits every unset optional filter', () => {
    const request = buildAuctionListRequest({ page: 2, per_page: 20 })
    expect(request.page).toBe(2)
    expect(request.per_page).toBe(20)
    expect(request.cargo_num).toBeUndefined()
    expect(request.load_date_from).toBeUndefined()
  })

  it('converts a load_date_from/to date to a start/end-of-day +03:00 timestamp', () => {
    const request = buildAuctionListRequest({ page: 1, per_page: 20, load_date_from: '2026-05-01', load_date_to: '2026-05-10' })
    expect(request.load_date_from).toBe('2026-05-01T00:00:00+03:00')
    expect(request.load_date_to).toBe('2026-05-10T23:59:59+03:00')
  })

  it('passes filter fields through unchanged', () => {
    const request = buildAuctionListRequest({
      page: 1,
      per_page: 20,
      cargo_num: '00000001059',
      auc_type: ['Up', 'Down'],
      is_available: true,
      current_price_from: 1000,
      current_price_to: 5000,
    })
    expect(request.cargo_num).toBe('00000001059')
    expect(request.auc_type).toEqual(['Up', 'Down'])
    expect(request.is_available).toBe(true)
    expect(request.current_price_from).toBe(1000)
    expect(request.current_price_to).toBe(5000)
  })
})
