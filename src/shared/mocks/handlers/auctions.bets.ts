import { http, HttpResponse } from 'msw'

import { AuctionType, TradingStatus, type BetListResponse, type ProblemDetail, type SetBetRequest, type ValidationError, type ValidationProblem } from '@/shared/api'

import { CURRENT_USER } from '../db/current-user'
import { bet } from '../db/factories'
import { getAuctionByUuid, recomputePlaces } from '../db/store'

function notFound() {
  const problem: ProblemDetail = { code: 'resource_not_found', title: 'Не найдено', message: 'Заявка не найдена' }
  return HttpResponse.json(problem, { status: 404 })
}

export const listBetsHandler = http.get('/api/v1/auctions/:auctionUuid/bets', ({ params, request }) => {
  const db = getAuctionByUuid(params.auctionUuid as string)
  if (!db) return notFound()

  const includeAll = new URL(request.url).searchParams.get('all') === 'true'
  const bets = includeAll ? db.bets : db.bets.filter((b) => !b.cancel_reason)
  const response: BetListResponse = { bets }
  return HttpResponse.json(response)
})

function validateBet(db: ReturnType<typeof getAuctionByUuid>, price: number): ValidationError[] {
  const errors: ValidationError[] = []
  if (!(price > 0)) {
    errors.push({ field: 'price', message: 'Цена должна быть больше 0.', code: 'min_value' })
    return errors
  }
  if (!db!.trading.can_set_bet) {
    errors.push({ field: 'price', message: 'Ставки в этом аукционе недоступны.', code: 'bet_not_allowed' })
    return errors
  }

  const { price: p } = db!.trading
  if (db!.auc_type === AuctionType.DOWN && p.current !== null && p.step !== null && price > p.current - p.step) {
    errors.push({ field: 'price', message: `Ставка должна быть ниже текущей минимум на шаг (${p.step}).`, code: 'step_violation' })
  } else if (db!.auc_type === AuctionType.UP && p.current !== null && price <= p.current) {
    errors.push({ field: 'price', message: 'Ставка должна превышать текущую цену.', code: 'must_exceed_current' })
  } else if (db!.auc_type === AuctionType.FIX_PRICE && p.available !== null && price !== p.available) {
    errors.push({ field: 'price', message: `Цена должна быть равна доступной (${p.available}).`, code: 'must_equal_available' })
  }
  return errors
}

export const setBetHandler = http.post('/api/v1/auctions/:auctionUuid/bets', async ({ params, request }) => {
  const db = getAuctionByUuid(params.auctionUuid as string)
  if (!db) return notFound()

  const body = ((await request.json().catch(() => ({}))) ?? {}) as SetBetRequest
  const errors = validateBet(db, body.price)
  if (errors.length) {
    const problem: ValidationProblem = { code: 'validation_failed', title: 'Ошибка валидации', message: 'Запрос содержит некорректные поля.', errors }
    return HttpResponse.json(problem, { status: 422 })
  }

  const priceNoVat = Math.round((body.price / 1.2) * 100) / 100
  const newBet = bet({
    auctionId: db.id,
    priceWithVat: body.price,
    priceNoVat,
    organizationName: CURRENT_USER.organizationName,
    organizationInn: CURRENT_USER.organizationInn,
    contactName: CURRENT_USER.contactName,
    createdAt: new Date().toISOString(),
  })
  db.bets.unshift(newBet)
  recomputePlaces(db)

  db.trading.price.current = body.price
  db.trading.price.current_no_vat = priceNoVat
  db.trading.your = { bet: true, last_bet: body.price, last_bet_with_vat: body.price, win: false }
  db.trading.status_mobile = TradingStatus.LEADING
  db.trading.is_bidder = true

  return HttpResponse.json(newBet)
})
