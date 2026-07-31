import { http, HttpResponse } from 'msw'

import type { AuctionListRequest, AuctionListResponseBase, ProblemDetail } from '@/shared/api'

import { getAllAuctions, toListItem } from '../db/store'

/** Numeric AuctionStatus codes used by AuctionListRequest.statuses (schema-documented order). */
const STATUS_CODE_BY_NAME: Record<string, number> = { Planning: 1, Auction: 2, DeterminateWinner: 3, WaitDeal: 4, InProgress: 5, Finished: 6, Stopped: 7, Canceled: 8 }

export const listAuctionsHandler = http.post('/api/v1/auctions/list', async ({ request }) => {
  const body = ((await request.json().catch(() => ({}))) ?? {}) as AuctionListRequest

  // Deliberate test hook: cargo_num="__error__" triggers a 503 so the error
  // state is reachable from the UI without relying on flaky randomness.
  if (body.cargo_num === '__error__') {
    return HttpResponse.json<ProblemDetail>({ code: 'service_unavailable', title: 'Сервис недоступен', message: 'Не удалось получить список аукционов, попробуйте ещё раз.' }, { status: 503 })
  }

  let items = getAllAuctions()

  if (body.cargo_num) items = items.filter((a) => a.cargo_num.includes(body.cargo_num!))
  if (body.statuses?.length) items = items.filter((a) => body.statuses!.includes(STATUS_CODE_BY_NAME[a.trading.status] ?? -1))
  if (body.status?.length) items = items.filter((a) => body.status!.includes(a.trading.status_mobile))
  if (body.auc_type?.length) items = items.filter((a) => (body.auc_type as readonly string[]).includes(a.auc_type))
  if (body.load_city) items = items.filter((a) => a.routes.some((p) => p.op_type === 'Loading' && p.location.city_name === body.load_city))
  if (body.unload_city) items = items.filter((a) => a.routes.some((p) => p.op_type === 'Unloading' && p.location.city_name === body.unload_city))
  if (body.load_date_from) items = items.filter((a) => a.routes.some((p) => p.op_type === 'Loading' && p.start_date >= body.load_date_from!))
  if (body.load_date_to) items = items.filter((a) => a.routes.some((p) => p.op_type === 'Loading' && p.start_date <= body.load_date_to!))
  if (body.is_available !== undefined && body.is_available !== null) items = items.filter((a) => a.trading.is_available === body.is_available)
  if (body.is_bidder !== undefined && body.is_bidder !== null) items = items.filter((a) => a.trading.is_bidder === body.is_bidder)
  if (body.is_favorite !== undefined && body.is_favorite !== null) items = items.filter((a) => a.trading.is_favorite === body.is_favorite)
  if (body.current_price_from != null) items = items.filter((a) => (a.trading.price.current ?? -Infinity) >= body.current_price_from!)
  if (body.current_price_to != null) items = items.filter((a) => (a.trading.price.current ?? Infinity) <= body.current_price_to!)
  if (body.price_per_km_from != null) items = items.filter((a) => a.trading.price_per_km >= body.price_per_km_from!)
  if (body.price_per_km_to != null) items = items.filter((a) => a.trading.price_per_km <= body.price_per_km_to!)

  // is_oldest: true = ASC by date, false/undefined = DESC (default, newest first).
  const direction = body.is_oldest ? 1 : -1
  items = [...items].sort((a, b) => direction * a.created_at.localeCompare(b.created_at))

  const page = body.page ?? 1
  const perPage = body.per_page ?? 20
  const total = items.length
  const start = (page - 1) * perPage
  const paged = items.slice(start, start + perPage)

  const response: AuctionListResponseBase = {
    data: paged.map(toListItem),
    meta: {
      current_page: page,
      from: total === 0 ? 0 : start + 1,
      last_page: Math.max(1, Math.ceil(total / perPage)),
      per_page: perPage,
      to: Math.min(start + perPage, total),
      total,
    },
  }
  return HttpResponse.json(response)
})
