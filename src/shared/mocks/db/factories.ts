import { AuctionStatus, AuctionType, BidMeasurementType, OperationType, TradingStatus } from '@/shared/api'
import type { BetItem } from '@/shared/api'
import { CITIES } from '@/shared/config/cities'

import type { DbAuction, DbRoutePoint } from './types'

const PERM = CITIES[0]!
const MOSCOW = CITIES[1]!

let nextAuctionId = 1000
let nextBetId = 1

const DEFAULT_AUCTION: DbAuction = {
  id: 0,
  order_uid: '',
  cargo_num: '00000001059',
  cargo_date: '2026-05-04T14:49:09',
  auc_type: AuctionType.DOWN,
  created_at: '2026-05-25T11:48:20',
  priority_sort: 0,
  is_assembly: false,

  organizer: {
    subscriber_id: 98,
    subscriber_code: '12345',
    infobase_code: 'RU_Cargo_01',
    organization_id: 340,
    organization_name: 'ЛИМ',
    organization_inn: '7703769184',
    organization_kpp: '770301001',
    is_hide_organization: false,
  },

  contacts: [{ name: 'Иванов Иван Иванович', phone: '+79001234567', work_phone: null, uid: '550e8400-e29b-41d4-a716-446655440000', email: 'ivanov@example.com' }],

  routes: [
    routePoint({ row_num: 1, op_type: OperationType.LOADING, city: PERM, address: 'Транспортная 9', start_date: '2026-05-26T09:00:00', end_date: '2026-05-26T18:00:00' }),
    routePoint({ row_num: 2, op_type: OperationType.UNLOADING, city: MOSCOW, address: 'Складская 1', start_date: '2026-05-28T09:00:00', end_date: '2026-05-28T18:00:00' }),
  ],

  cargo: {
    name: 'Мороженое',
    weight: 1,
    volume: 1,
    body_type: 'тентованный',
    truck_count: 1,
    is_cargo: true,
    is_international: false,
    containered: false,
    incoterms: null,
    conics: null,
    belts: null,
    adr: null,
    coupling: null,
    air_pass: null,
    low_loader: null,
    additional_load: null,
    temp_from: null,
    temp_to: null,
    loading_types: { side: false, top: false, rear: false, full: false },
    docs: { tir: false, cmr: false, t1: false, med: false },
    car: null,
    price: '0',
    currency: 643,
    distance: 1500,
    container_type: null,
    container_size: null,
  },

  payment: {
    form: 'Безналичная с НДС',
    currency_code: '643',
    consignor: null,
    consignee: null,
    condition: 'По оригиналам накладных (ТН, ТТН, CMR)',
    condition_predefined: 'ПоОригиналамНаладных',
    delay: 30,
    delay_type: 'CalendarDays',
    prepay: '0',
  },

  assembly: { num: null, date: null },

  admitted_organizations: [],

  trading: {
    status: AuctionStatus.AUCTION,
    status_mobile: TradingStatus.NOT_PARTICIPATING,
    start_time: '2026-05-25T16:03:00',
    stop_time: '2026-05-25T16:18:00',
    bid_measurement_type: BidMeasurementType.PER_ROUTE,
    can_set_bet: true,
    allow_counter_bets: true,
    hide_bets_history: false,
    hide_places: false,
    no_view_cargo_price: false,
    hide_points_address_and_contacts: false,
    is_bidder: false,
    is_available: true,
    is_accredited: false,
    is_favorite: false,
    direction: null,
    comment: null,
    red_bet_with_vat: false,
    red_bet_no_vat: false,
    is_last_bet_with_vat: null,
    send_deal_before_load: false,
    chat_id: null,
    price: { start: 30000, start_no_vat: 25000, current: 30000, current_no_vat: 24590.16, available: 29000, available_no_vat: 24166, min: 20000, min_no_vat: 16666.67, max: 30000, max_no_vat: 25000, step: 500, step_no_vat: 416.67 },
    price_per_km: 16.39,
    your: { bet: false, last_bet: null, last_bet_with_vat: null, win: false },
    settings: { prolong_after_bet: 10, winner_confirm: 1, winner_counter_mode: null, transmission_time_in: 24, coefficient: 10 },
  },

  bets: [],
}

interface RoutePointInput {
  row_num: number
  op_type: DbRoutePoint['op_type']
  city: { gcId: number; name: string }
  address: string
  start_date: string
  end_date: string
  contractor?: string
  contact?: { name: string; phone: string }
  comment?: string | null
}

export function routePoint(input: RoutePointInput): DbRoutePoint {
  return {
    row_num: input.row_num,
    op_type: input.op_type,
    start_date: input.start_date,
    end_date: input.end_date,
    comment: input.comment ?? null,
    contractor: input.contractor ?? '',
    contractor_inn: '',
    location: { city_name: input.city.name, city_full_name: `${input.city.name}, Россия`, city_gc_id: input.city.gcId, loading_address: input.address, lon: 56.238, lat: 58.01 },
    cargo: { name: 'Мороженое', package_name: '', weight: '1.000', volume: '1.000', length: '0', width: '0', height: '0', oversized: false, package_amount: null },
    contact: input.contact ?? { name: '', phone: '' },
  }
}

interface BetInput {
  auctionId: number
  priceWithVat: number
  priceNoVat: number
  organizationName?: string
  organizationInn?: string
  contactName?: string
  isWin?: boolean
  isRejected?: boolean
  cancelReason?: string
  createdAt?: string
}

export function bet(input: BetInput): BetItem {
  return {
    id: nextBetId++,
    created_at: input.createdAt ?? '2026-05-25T16:05:00',
    auction_id: input.auctionId,
    subscriber_id: 100 + input.auctionId,
    contact_name: input.contactName ?? 'Петров Пётр',
    contact_phone: '+79007654321',
    price_with_vat: input.priceWithVat,
    price_no_vat: input.priceNoVat,
    organization_id: 200 + input.auctionId,
    organization_inn: input.organizationInn ?? '5000000001',
    organization_name: input.organizationName ?? 'ООО Перевозчик',
    transporter_comment: null,
    is_rejected: input.isRejected ?? false,
    is_counter: false,
    place: null,
    is_win: input.isWin ?? false,
    run_number: 0,
    cancel_reason: input.cancelReason ?? '',
    price_info: { price_with_vat: input.priceWithVat, price_no_vat: input.priceNoVat, payment_type: 'Безналичная с НДС', vat_rate: '20' },
  }
}

type NestedOverrides = Partial<Omit<DbAuction, 'organizer' | 'cargo' | 'payment' | 'trading' | 'assembly'>> & {
  organizer?: Partial<DbAuction['organizer']>
  cargo?: Partial<DbAuction['cargo']>
  payment?: Partial<DbAuction['payment']>
  assembly?: Partial<DbAuction['assembly']>
  trading?: Partial<Omit<DbAuction['trading'], 'price' | 'your' | 'settings'>> & {
    price?: Partial<DbAuction['trading']['price']>
    your?: Partial<DbAuction['trading']['your']>
    settings?: Partial<DbAuction['trading']['settings']>
  }
}

/** Builds one seed auction from DEFAULT_AUCTION, one shallow-merge level deep per nested object. */
export function createDbAuction(overrides: NestedOverrides): DbAuction {
  const id = nextAuctionId++
  return {
    ...DEFAULT_AUCTION,
    ...overrides,
    id,
    order_uid: overrides.order_uid ?? crypto.randomUUID(),
    organizer: { ...DEFAULT_AUCTION.organizer, ...overrides.organizer },
    cargo: { ...DEFAULT_AUCTION.cargo, ...overrides.cargo },
    payment: { ...DEFAULT_AUCTION.payment, ...overrides.payment },
    assembly: { ...DEFAULT_AUCTION.assembly, ...overrides.assembly },
    trading: {
      ...DEFAULT_AUCTION.trading,
      ...overrides.trading,
      price: { ...DEFAULT_AUCTION.trading.price, ...overrides.trading?.price },
      your: { ...DEFAULT_AUCTION.trading.your, ...overrides.trading?.your },
      settings: { ...DEFAULT_AUCTION.trading.settings, ...overrides.trading?.settings },
    },
    routes: overrides.routes ?? DEFAULT_AUCTION.routes,
    bets: overrides.bets ?? [],
  }
}
