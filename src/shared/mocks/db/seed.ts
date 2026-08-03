import { AuctionStatus, AuctionType, OperationType, TradingStatus } from '@/shared/api'
import { CITIES } from '@/shared/config/cities'

import { bet, createDbAuction, routePoint } from './factories'
import { recomputePlaces, seedAuctions } from './store'
import type { DbAuction } from './types'

const SPB = CITIES[2]!
const EKB = CITIES[3]!

const uuid = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`

// 1. Стандартный аукцион, ставки ещё нет — доступна кнопка «Сделать ставку».
const auction01 = createDbAuction({
  order_uid: uuid(1),
  cargo_num: '00000002001',
  trading: { status: AuctionStatus.AUCTION, can_set_bet: true, status_mobile: TradingStatus.NOT_PARTICIPATING, is_favorite: true },
})

// 2. Уже есть своя ставка, лидирует — «Изменить ставку».
const auction02 = createDbAuction({
  order_uid: uuid(2),
  cargo_num: '00000002002',
  trading: { status: AuctionStatus.AUCTION, can_set_bet: true, status_mobile: TradingStatus.LEADING, is_bidder: true, your: { bet: true, last_bet: 29500 } },
  bets: [bet({ auctionId: 1001, priceWithVat: 29500, priceNoVat: 24180, organizationName: 'ООО Перевозчик', isWin: false })],
})

// 3. Своя ставка есть, но перебита — Losing.
const auction03 = createDbAuction({
  order_uid: uuid(3),
  cargo_num: '00000002003',
  trading: { status: AuctionStatus.AUCTION, can_set_bet: true, status_mobile: TradingStatus.LOSING, is_bidder: true, your: { bet: true, last_bet: 29800 } },
  bets: [
    bet({ auctionId: 1002, priceWithVat: 29600, priceNoVat: 24666.67, organizationName: 'ООО Лидер' }),
    bet({ auctionId: 1002, priceWithVat: 29800, priceNoVat: 24833.33, organizationName: 'ООО Перевозчик' }),
  ],
})

// 4. Аукцион на повышение (Up).
const auction04 = createDbAuction({
  order_uid: uuid(4),
  cargo_num: '00000002004',
  auc_type: AuctionType.UP,
  trading: { status: AuctionStatus.AUCTION, can_set_bet: true, price: { start: 10000, current: 10500, current_no_vat: 8607, min: 10000, min_no_vat: 8197, max: null, max_no_vat: null, step: 500, step_no_vat: 410 } },
})

// 5. FixPrice, шаг ставки не задан.
const auction05 = createDbAuction({
  order_uid: uuid(5),
  cargo_num: '00000002005',
  auc_type: AuctionType.FIX_PRICE,
  trading: { status: AuctionStatus.AUCTION, can_set_bet: true, price: { start: 25000, current: 25000, current_no_vat: 20492, available: 25000, available_no_vat: 20492, min: 25000, min_no_vat: 20492, max: 25000, max_no_vat: 20492, step: null, step_no_vat: null } },
})

// 6. Заявочный тип (Request), ставка недоступна.
const auction06 = createDbAuction({
  order_uid: uuid(6),
  cargo_num: '00000002006',
  auc_type: AuctionType.REQUEST,
  trading: { status: AuctionStatus.PLANNING, can_set_bet: false, is_available: false },
})

// 7. Завершён, наш — победитель.
const auction07 = createDbAuction({
  order_uid: uuid(7),
  cargo_num: '00000002007',
  trading: { status: AuctionStatus.FINISHED, can_set_bet: false, is_available: false, is_bidder: true, status_mobile: TradingStatus.WINNER, your: { bet: true, last_bet: 28000, win: true } },
  bets: [bet({ auctionId: 1006, priceWithVat: 28000, priceNoVat: 22950, isWin: true, organizationName: 'ООО Перевозчик' })],
})

// 8. Завершён, наш — проигравший.
const auction08 = createDbAuction({
  order_uid: uuid(8),
  cargo_num: '00000002008',
  trading: { status: AuctionStatus.FINISHED, can_set_bet: false, is_available: false, is_bidder: true, status_mobile: TradingStatus.LOSING, your: { bet: true, last_bet: 29000 } },
  bets: [
    bet({ auctionId: 1007, priceWithVat: 27500, priceNoVat: 22541, isWin: true, organizationName: 'ООО Конкурент' }),
    bet({ auctionId: 1007, priceWithVat: 29000, priceNoVat: 24166.67, organizationName: 'ООО Перевозчик' }),
  ],
})

// 9. Планирование, ставка недоступна и аукцион недоступен.
const auction09 = createDbAuction({
  order_uid: uuid(9),
  cargo_num: '00000002009',
  trading: {
    status: AuctionStatus.PLANNING,
    can_set_bet: false,
    is_available: false,
    price: { start: null, current: null, current_no_vat: null, available: null, available_no_vat: null, min: null, min_no_vat: null, max: null, max_no_vat: null, step: null, step_no_vat: null },
    price_per_km: 0,
  },
})

// 10. Отменён.
const auction10 = createDbAuction({
  order_uid: uuid(10),
  cargo_num: '00000002010',
  trading: { status: AuctionStatus.CANCELED, can_set_bet: false, is_available: false },
})

// 11. Идут торги, но мы не допущены — can_set_bet=false несмотря на статус Auction.
const auction11 = createDbAuction({
  order_uid: uuid(11),
  cargo_num: '00000002011',
  trading: { status: AuctionStatus.AUCTION, can_set_bet: false, is_available: false },
})

// 12. История ставок скрыта.
const auction12 = createDbAuction({
  order_uid: uuid(12),
  cargo_num: '00000002012',
  trading: { status: AuctionStatus.AUCTION, can_set_bet: true, hide_bets_history: true },
  bets: [bet({ auctionId: 1011, priceWithVat: 29000, priceNoVat: 23770, organizationName: 'ООО Сторонний' })],
})

// 13. Адрес и контакты скрыты.
const auction13 = createDbAuction({
  order_uid: uuid(13),
  cargo_num: '00000002013',
  trading: { status: AuctionStatus.AUCTION, can_set_bet: true, hide_points_address_and_contacts: true },
})

// 14. Цена груза скрыта.
const auction14 = createDbAuction({
  order_uid: uuid(14),
  cargo_num: '00000002014',
  trading: { status: AuctionStatus.AUCTION, can_set_bet: true, no_view_cargo_price: true },
  cargo: { price: '150000' },
})

// 15. Ставок ещё нет (empty state, отличный от скрытой истории).
const auction15 = createDbAuction({
  order_uid: uuid(15),
  cargo_num: '00000002015',
  trading: { status: AuctionStatus.AUCTION, can_set_bet: true },
  bets: [],
})

// 16. Ставки: отклонённая, отменённая (с причиной) и победившая.
const auction16 = createDbAuction({
  order_uid: uuid(16),
  cargo_num: '00000002016',
  trading: { status: AuctionStatus.FINISHED, can_set_bet: false, is_available: false },
  bets: [
    bet({ auctionId: 1015, priceWithVat: 27000, priceNoVat: 22131, isWin: true, organizationName: 'ООО Победитель' }),
    bet({ auctionId: 1015, priceWithVat: 27800, priceNoVat: 22787, isRejected: true, organizationName: 'ООО Отклонённый' }),
    bet({ auctionId: 1015, priceWithVat: 28200, priceNoVat: 23115, cancelReason: 'Отозвана перевозчиком', organizationName: 'ООО Передумавший' }),
  ],
})

// 17. Международная перевозка, все доп. документы и требования к ТС заполнены.
const auction17 = createDbAuction({
  order_uid: uuid(17),
  cargo_num: '00000002017',
  trading: { status: AuctionStatus.AUCTION, can_set_bet: true },
  cargo: {
    is_international: true,
    containered: true,
    container_type: 'Reefer',
    container_size: '40HC',
    incoterms: 'DAP',
    conics: 2,
    belts: 4,
    adr: 3,
    coupling: true,
    air_pass: true,
    low_loader: false,
    additional_load: true,
    temp_from: -18,
    temp_to: -10,
    loading_types: { side: true, top: false, rear: true, full: true },
    docs: { tir: true, cmr: true, t1: true, med: true },
    car: { type: 'Тягач + рефрижератор', weight: 20, volume: 82, width: 2.4, length: 13.6, height: 2.7 },
  },
  routes: [
    routePoint({ row_num: 1, op_type: OperationType.LOADING, city: SPB, address: 'Портовая 3', start_date: '2026-06-01T08:00:00', end_date: '2026-06-01T16:00:00' }),
    routePoint({ row_num: 2, op_type: OperationType.UNLOADING, city: EKB, address: 'Логистическая 12', start_date: '2026-06-04T10:00:00', end_date: '2026-06-04T18:00:00' }),
  ],
})

// 18. Избранный, cargo_num совпадает с примером из схемы — для поиска по номеру заявки.
const auction18 = createDbAuction({
  order_uid: uuid(18),
  trading: { status: AuctionStatus.AUCTION, can_set_bet: true, is_favorite: true },
})

// 19. Места в ставках скрыты (hide_places) — ставки настоящие (места
// пересчитаны через recomputePlaces), а не null, иначе от скрытия было бы
// не отличить обычное отсутствие данных.
const auction19 = createDbAuction({
  order_uid: uuid(19),
  cargo_num: '00000002019',
  trading: { status: AuctionStatus.AUCTION, can_set_bet: true, hide_places: true },
  bets: [
    bet({ auctionId: 1018, priceWithVat: 29500, priceNoVat: 24180, organizationName: 'ООО Лидер' }),
    bet({ auctionId: 1018, priceWithVat: 29000, priceNoVat: 23770, organizationName: 'ООО Второй' }),
  ],
})
recomputePlaces(auction19)

// 20. Маршрут с промежуточной точкой — 3 точки вместо обычных 2 (погрузка,
// промежуточная частичная выгрузка, финальная выгрузка). routes[] — обычный
// массив без ограничения на пару load/unload.
const auction20 = createDbAuction({
  order_uid: uuid(20),
  cargo_num: '00000002020',
  trading: { status: AuctionStatus.AUCTION, can_set_bet: true },
  routes: [
    routePoint({ row_num: 1, op_type: OperationType.LOADING, city: CITIES[0]!, address: 'Транспортная 9', start_date: '2026-05-26T09:00:00', end_date: '2026-05-26T18:00:00' }),
    routePoint({ row_num: 2, op_type: OperationType.UNLOADING, city: CITIES[1]!, address: 'Промежуточная 5', start_date: '2026-05-27T09:00:00', end_date: '2026-05-27T14:00:00' }),
    routePoint({ row_num: 3, op_type: OperationType.UNLOADING, city: SPB, address: 'Складская 1', start_date: '2026-05-28T09:00:00', end_date: '2026-05-28T18:00:00' }),
  ],
})

// 21-29. Маршруты с 2..10 точками — систематическая проверка, что RoutesCard
// рендерит произвольную длину routes[], а не только пару load/unload.
// Чередование Loading/Unloading, последняя точка всегда Unloading.
const routePointCounts = Array.from({ length: 9 }, (_, i) => {
  const pointCount = i + 2
  const routes = Array.from({ length: pointCount }, (_, p) => {
    const isLast = p === pointCount - 1
    const pointDate = new Date(Date.UTC(2026, 4, 26 + p))
    const pointDateIso = pointDate.toISOString().replace('.000Z', '')

    return routePoint({
      row_num: p + 1,
      op_type: isLast || p % 2 === 1 ? OperationType.UNLOADING : OperationType.LOADING,
      city: CITIES[p % CITIES.length]!,
      address: `Точка ${p + 1}`,
      start_date: pointDateIso,
      end_date: pointDateIso,
    })
  })

  return createDbAuction({
    order_uid: uuid(21 + i),
    cargo_num: String(2021 + i).padStart(11, '0'),
    trading: { status: AuctionStatus.AUCTION, can_set_bet: true },
    routes,
  })
})

// 30+. Filler auctions: pushes the total past one page (per_page=20) so pagination
// is visible, and cycles every filterable dimension (city pair, auc_type, auction
// status, my-status, availability/bidder, price, load date) so each FiltersPanel
// option actually matches something.
const AUC_TYPES = [AuctionType.REQUEST, AuctionType.UP, AuctionType.DOWN, AuctionType.FIX_PRICE]
const AUCTION_STATUSES = [AuctionStatus.PLANNING, AuctionStatus.AUCTION, AuctionStatus.DETERMINATE_WINNER, AuctionStatus.WAIT_DEAL, AuctionStatus.IN_PROGRESS, AuctionStatus.FINISHED, AuctionStatus.STOPPED, AuctionStatus.CANCELED]
const MY_STATUSES = [TradingStatus.NOT_PARTICIPATING, TradingStatus.LEADING, TradingStatus.LOSING, TradingStatus.ON_PENDING, TradingStatus.CONFIRMED, TradingStatus.CHOOSING_WINNER, TradingStatus.WINNER, TradingStatus.ACCEPTED]

const filler = Array.from({ length: 26 }, (_, i) => {
  // Betting only ever opens up during active trading, same as every hand-authored auction
  // above (01-20) — deriving can_set_bet/is_available from an independent i%2 cycle let a
  // filler row land on e.g. `DeterminateWinner` + can_set_bet:true, which can't happen for real.
  const status = AUCTION_STATUSES[i % AUCTION_STATUSES.length]
  const canBid = status === AuctionStatus.AUCTION
  const loadCity = CITIES[i % CITIES.length]!
  const unloadCity = CITIES[(i + 5) % CITIES.length]!
  const loadDate = new Date(Date.UTC(2026, 4, 1 + i * 3))
  const loadDateIso = loadDate.toISOString().replace('.000Z', '')

  return createDbAuction({
    order_uid: uuid(30 + i),
    cargo_num: String(2030 + i).padStart(11, '0'),
    auc_type: AUC_TYPES[i % AUC_TYPES.length],
    trading: {
      status,
      status_mobile: MY_STATUSES[i % MY_STATUSES.length],
      is_available: canBid,
      can_set_bet: canBid,
      is_bidder: i % 3 === 0,
      price: { current: 5000 + i * 2200, current_no_vat: Math.round((5000 + i * 2200) / 1.2) },
    },
    routes: [
      routePoint({ row_num: 1, op_type: OperationType.LOADING, city: loadCity, address: 'Транспортная 9', start_date: loadDateIso, end_date: loadDateIso }),
      routePoint({ row_num: 2, op_type: OperationType.UNLOADING, city: unloadCity, address: 'Складская 1', start_date: loadDateIso, end_date: loadDateIso }),
    ],
  })
})

const SEED: DbAuction[] = [auction01, auction02, auction03, auction04, auction05, auction06, auction07, auction08, auction09, auction10, auction11, auction12, auction13, auction14, auction15, auction16, auction17, auction18, auction19, auction20, ...routePointCounts, ...filler]

export function resetMockDb() {
  seedAuctions(SEED.map((a) => ({ ...a, bets: [...a.bets] })))
}
