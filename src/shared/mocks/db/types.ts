import type { AdmittedOrganization, AuctionStatus, AuctionType, BetItem, BidMeasurementType, Contact, OperationType, PaymentDelayType, TradingStatus } from '@/shared/api'

/**
 * Canonical mock record MSW reads/mutates. Field names deliberately mirror
 * the OpenAPI schema (snake_case) rather than idiomatic camelCase — this
 * type exists only to be mapped into AuctionListItem/AuctionShowResponse by
 * the two functions in store.ts, so staying close to the wire shape keeps
 * those mappers mostly pick/pass-through instead of a second renaming pass.
 */
export interface DbAuction {
  // main
  id: number
  order_uid: string
  cargo_num: string
  cargo_date: string
  auc_type: (typeof AuctionType)[keyof typeof AuctionType]
  created_at: string
  priority_sort: number
  is_assembly: boolean

  organizer: {
    subscriber_id: number
    subscriber_code: string
    infobase_code: string
    organization_id: number
    organization_name: string
    organization_inn: string
    organization_kpp: string
    is_hide_organization: boolean
  }

  contacts: Contact[]

  routes: DbRoutePoint[]

  cargo: DbCargo

  payment: DbPayment

  assembly: { num: string | null; date: string | null }

  admitted_organizations: AdmittedOrganization[]

  trading: DbTrading

  bets: BetItem[]
}

export interface DbRoutePoint {
  row_num: number
  op_type: (typeof OperationType)[keyof typeof OperationType]
  start_date: string
  end_date: string
  comment: string | null
  contractor: string
  contractor_inn: string
  location: {
    city_name: string
    city_full_name: string
    city_gc_id: number
    loading_address: string
    lon: number
    lat: number
  }
  cargo: {
    name: string
    package_name: string
    weight: string
    volume: string
    length: string
    width: string
    height: string
    oversized: boolean
    package_amount: number | null
  }
  contact: { name: string; phone: string }
}

export interface DbCargo {
  name: string
  weight: number
  volume: number
  body_type: string
  truck_count: number
  is_cargo: boolean
  is_international: boolean
  containered: boolean
  incoterms: string | null
  conics: number | null
  belts: number | null
  adr: number | null
  coupling: boolean | null
  air_pass: boolean | null
  low_loader: boolean | null
  additional_load: boolean | null
  temp_from: number | null
  temp_to: number | null
  loading_types: { side: boolean; top: boolean; rear: boolean; full: boolean }
  docs: { tir: boolean; cmr: boolean; t1: boolean; med: boolean }
  car: { type: string; weight: number; volume: number; width: number; length: number; height: number } | null
  // show-only
  price: string
  currency: number | null
  distance: number | null
  container_type: string | null
  container_size: string | null
}

export interface DbPayment {
  form: string
  currency_code: string
  // list-only
  consignor: string | null
  consignee: string | null
  // show-only
  condition: string | null
  condition_predefined: string | null
  delay: number | null
  delay_type: (typeof PaymentDelayType)[keyof typeof PaymentDelayType] | null
  prepay: string | null
}

export interface DbTrading {
  status: (typeof AuctionStatus)[keyof typeof AuctionStatus]
  /** Wider (9-value) show-schema type; toListItem narrows to the 6-value list-schema type. */
  status_mobile: (typeof TradingStatus)[keyof typeof TradingStatus]
  start_time: string
  stop_time: string
  bid_measurement_type: (typeof BidMeasurementType)[keyof typeof BidMeasurementType] | null
  can_set_bet: boolean
  allow_counter_bets: boolean
  hide_bets_history: boolean
  hide_places: boolean
  no_view_cargo_price: boolean
  hide_points_address_and_contacts: boolean
  is_bidder: boolean
  is_available: boolean
  is_accredited: boolean
  is_favorite: boolean
  direction: string | null
  comment: string | null
  red_bet_with_vat: boolean
  red_bet_no_vat: boolean
  is_last_bet_with_vat: boolean | null
  send_deal_before_load: boolean
  chat_id: string | null
  price: {
    start: number | null
    start_no_vat: number | null
    current: number | null
    current_no_vat: number | null
    available: number | null
    available_no_vat: number | null
    min: number | null
    min_no_vat: number | null
    max: number | null
    max_no_vat: number | null
    step: number | null
    step_no_vat: number | null
  }
  price_per_km: number
  your: { bet: boolean; last_bet: number | null; last_bet_with_vat: number | null; win: boolean }
  settings: {
    prolong_after_bet: number | null
    winner_confirm: number | null
    winner_counter_mode: number | null
    transmission_time_in: number | null
    coefficient: number | null
  }
}
