import { OperationType, TradingStatus, type AuctionListItem, type AuctionShowResponse } from '@/shared/api'

import type { DbAuction, DbRoutePoint } from './types'

const auctions = new Map<string, DbAuction>()

export function seedAuctions(records: DbAuction[]) {
  auctions.clear()
  for (const record of records) auctions.set(record.order_uid, record)
}

export function getAuctionByUuid(orderUid: string): DbAuction | undefined {
  return auctions.get(orderUid)
}

export function getAllAuctions(): DbAuction[] {
  return Array.from(auctions.values())
}

/** Recomputes `place` (rank by price, best first) across an auction's non-cancelled bets. */
export function recomputePlaces(db: DbAuction) {
  const ranked = db.bets
    .filter((bet) => !bet.is_rejected && !bet.cancel_reason)
    .sort((a, b) => (b.price_no_vat ?? 0) - (a.price_no_vat ?? 0))
  ranked.forEach((bet, index) => {
    bet.place = index + 1
  })
}

function findRoutePoint(db: DbAuction, opType: string): DbRoutePoint | undefined {
  return db.routes.find((point) => point.op_type === opType)
}

function countRoutePoints(db: DbAuction, opType: string): number {
  return db.routes.filter((point) => point.op_type === opType).length
}

/** AuctionListItemTrading.status_mobile only allows 6 of TradingStatus's 9 values. */
const LIST_STATUS_MOBILE = new Set<string>([
  TradingStatus.NOT_PARTICIPATING,
  TradingStatus.LEADING,
  TradingStatus.LOSING,
  TradingStatus.WINNER,
  TradingStatus.CONFIRMED,
  TradingStatus.UNKNOWN,
])

type ListStatusMobile = NonNullable<AuctionListItem['trading']>['status_mobile']

function narrowListStatusMobile(statusMobile: DbAuction['trading']['status_mobile']): ListStatusMobile {
  return (LIST_STATUS_MOBILE.has(statusMobile) ? statusMobile : TradingStatus.UNKNOWN) as ListStatusMobile
}

export function toListItem(db: DbAuction): AuctionListItem {
  const load = findRoutePoint(db, OperationType.LOADING)
  const unload = findRoutePoint(db, OperationType.UNLOADING)
  const { trading } = db
  const hideAddressAndContacts = trading.hide_points_address_and_contacts

  return {
    main: {
      id: db.id,
      cargo_num: db.cargo_num,
      cargo_date: db.cargo_date,
      auc_type: db.auc_type,
      order_uid: db.order_uid,
      created_at: db.created_at,
      priority_sort: db.priority_sort,
      is_assembly: db.is_assembly,
      price_per_km: trading.price_per_km,
    },
    organizer: {
      subscriber_id: db.organizer.subscriber_id,
      organization_id: db.organizer.organization_id,
      organization_name: db.organizer.organization_name,
      organization_inn: db.organizer.organization_inn,
      organization_kpp: db.organizer.organization_kpp,
      is_hide_organization: db.organizer.is_hide_organization,
    },
    route: {
      load: load
        ? { city: load.location.city_name, address: hideAddressAndContacts ? undefined : load.location.loading_address, date: load.start_date, city_gc_id: load.location.city_gc_id, points_count: countRoutePoints(db, OperationType.LOADING) }
        : undefined,
      unload: unload
        ? { city: unload.location.city_name, address: hideAddressAndContacts ? undefined : unload.location.loading_address, date: unload.start_date, city_gc_id: unload.location.city_gc_id, points_count: countRoutePoints(db, OperationType.UNLOADING) }
        : undefined,
    },
    cargo: {
      name: db.cargo.name,
      weight: db.cargo.weight,
      volume: db.cargo.volume,
      body_type: db.cargo.body_type,
      truck_count: db.cargo.truck_count,
      is_cargo: db.cargo.is_cargo,
      is_international: db.cargo.is_international,
      containered: db.cargo.containered,
      incoterms: db.cargo.incoterms ?? undefined,
      conics: db.cargo.conics ?? undefined,
      belts: db.cargo.belts ?? undefined,
      adr: db.cargo.adr ?? undefined,
      coupling: db.cargo.coupling ?? undefined,
      air_pass: db.cargo.air_pass ?? undefined,
      low_loader: db.cargo.low_loader ?? undefined,
      additional_load: db.cargo.additional_load ?? undefined,
      temp_from: db.cargo.temp_from ?? undefined,
      temp_to: db.cargo.temp_to ?? undefined,
      loading_types: db.cargo.loading_types,
      docs: db.cargo.docs,
      car: db.cargo.car,
    },
    trading: {
      status: trading.status,
      status_mobile: narrowListStatusMobile(trading.status_mobile),
      start_time: trading.start_time,
      stop_time: trading.stop_time,
      bid_measurement_type: trading.bid_measurement_type ?? undefined,
      can_set_bet: trading.can_set_bet,
      allow_counter_bets: trading.allow_counter_bets,
      hide_points_address_and_contacts: trading.hide_points_address_and_contacts,
      direction: trading.direction ?? undefined,
      comment: trading.comment ?? undefined,
      is_bidder: trading.is_bidder,
      is_available: trading.is_available,
      is_accredited: trading.is_accredited,
      is_favorite: trading.is_favorite,
      price: trading.price.current === null ? null : { start: trading.price.start ?? undefined, current: trading.price.current, current_no_vat: trading.price.current_no_vat ?? undefined },
      your: trading.your.bet === false && trading.your.last_bet === null ? null : { bet: trading.your.bet, last_bet: trading.your.last_bet },
      red_bet_with_vat: trading.red_bet_with_vat,
      red_bet_no_vat: trading.red_bet_no_vat,
      is_last_bet_with_vat: trading.is_last_bet_with_vat ?? undefined,
    },
    payment: {
      form: db.payment.form,
      currency_code: db.payment.currency_code,
      consignor: db.payment.consignor ?? undefined,
      consignee: db.payment.consignee ?? undefined,
    },
  }
}

export function toShowResponse(db: DbAuction): AuctionShowResponse {
  const { trading } = db
  const hideAddressAndContacts = trading.hide_points_address_and_contacts

  return {
    main: {
      id: db.id,
      cargo_num: db.cargo_num,
      cargo_date: db.cargo_date,
      order_uid: db.order_uid,
      auc_type: db.auc_type,
      created_at: db.created_at,
    },
    organizer: { ...db.organizer },
    contacts: hideAddressAndContacts ? [] : db.contacts,
    cargo: {
      price: trading.no_view_cargo_price ? '0' : db.cargo.price,
      currency: db.cargo.currency,
      is_international: db.cargo.is_international,
      distance: db.cargo.distance,
      truck_count: db.cargo.truck_count,
      body_type: db.cargo.body_type,
      temp_from: db.cargo.temp_from,
      temp_to: db.cargo.temp_to,
      conics: db.cargo.conics,
      belts: db.cargo.belts,
      adr: db.cargo.adr,
      coupling: db.cargo.coupling,
      air_pass: db.cargo.air_pass,
      low_loader: db.cargo.low_loader,
      additional_load: db.cargo.additional_load,
      containered: db.cargo.containered,
      container_type: db.cargo.container_type,
      container_size: db.cargo.container_size,
      loading_types: db.cargo.loading_types,
      docs: db.cargo.docs,
      car: db.cargo.car,
    },
    trading: {
      status: trading.status,
      status_mobile: trading.status_mobile,
      start_time: trading.start_time,
      stop_time: trading.stop_time,
      bid_measurement_type: trading.bid_measurement_type ?? undefined,
      can_set_bet: trading.can_set_bet,
      allow_counter_bets: trading.allow_counter_bets,
      hide_bets_history: trading.hide_bets_history,
      hide_places: trading.hide_places,
      no_view_cargo_price: trading.no_view_cargo_price,
      hide_points_address_and_contacts: trading.hide_points_address_and_contacts,
      is_bidder: trading.is_bidder,
      is_favorite: trading.is_favorite,
      is_last_bet_with_vat: trading.is_last_bet_with_vat,
      red_bet_with_vat: trading.red_bet_with_vat,
      red_bet_no_vat: trading.red_bet_no_vat,
      send_deal_before_load: trading.send_deal_before_load,
      chat_id: trading.chat_id,
      price: { ...trading.price, price_per_km: trading.price_per_km },
      your: { ...trading.your },
      settings: { ...trading.settings },
    },
    payment: {
      condition: db.payment.condition,
      condition_predefined: db.payment.condition_predefined,
      form: db.payment.form,
      delay: db.payment.delay,
      delay_type: db.payment.delay_type ?? undefined,
      currency_code: db.payment.currency_code,
      prepay: db.payment.prepay,
    },
    assembly: { ...db.assembly },
    routes: db.routes.map((point) => ({
      row_num: point.row_num,
      op_type: point.op_type,
      start_date: point.start_date,
      end_date: point.end_date,
      comment: point.comment,
      contractor: point.contractor,
      contractor_inn: point.contractor_inn,
      location: hideAddressAndContacts ? { ...point.location, loading_address: '' } : point.location,
      cargo: point.cargo,
      contact: hideAddressAndContacts ? { name: '', phone: '' } : point.contact,
    })),
    admitted_organizations: db.admitted_organizations,
    hide_bets_history: trading.hide_bets_history,
  }
}
