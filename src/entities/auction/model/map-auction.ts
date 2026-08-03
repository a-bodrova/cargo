import type { AuctionListItem } from '@/shared/api'
import type { DeepRequired } from '@/shared/lib/deep-required'

import { getPrimaryAction } from './get-primary-action'
import type { AuctionCardViewModel } from './types'

export function mapAuctionToCard(dto: AuctionListItem): AuctionCardViewModel {
  const { main, route, cargo, trading } = dto as DeepRequired<AuctionListItem>

  return {
    uuid: main.order_uid,
    cargoNum: main.cargo_num,
    aucType: main.auc_type,
    status: trading.status,
    tradingStatus: trading.status_mobile,
    route: {
      loadCity: route.load?.city ?? '—',
      unloadCity: route.unload?.city ?? '—',
      // AuctionListItemRoute only ever carries one load + one unload point — intermediate
      // stops aren't exposed here, just their count (see routes[] on the detail DTO for the full list).
      totalStops: (route.load?.points_count ?? 0) + (route.unload?.points_count ?? 0),
    },
    loadDate: route.load?.date ?? null,
    unloadDate: route.unload?.date ?? null,
    cargo: {
      name: cargo.name,
      weight: cargo.weight,
      volume: cargo.volume,
      bodyType: cargo.body_type,
    },
    price: {
      current: trading.price?.current ?? null,
      perKm: main.price_per_km ?? null,
    },
    hasMyBet: trading.your?.bet === true,
    primaryAction: getPrimaryAction(trading),
  }
}
