import { http, HttpResponse } from 'msw'

import type { ProblemDetail } from '@/shared/api'

import { getAuctionByUuid, toShowResponse } from '../db/store'

export const getAuctionHandler = http.get('/api/v1/auctions/:auctionUuid', ({ params }) => {
  const db = getAuctionByUuid(params.auctionUuid as string)
  if (!db) {
    const problem: ProblemDetail = { code: 'resource_not_found', title: 'Не найдено', message: 'Заявка не найдена' }
    return HttpResponse.json(problem, { status: 404 })
  }
  return HttpResponse.json(toShowResponse(db))
})
