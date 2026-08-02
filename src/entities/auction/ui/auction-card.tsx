import { Link } from '@tanstack/react-router'

import { AuctionType } from '@/shared/api'
import { formatDate } from '@/shared/lib/format-date'
import { Badge } from '@/shared/ui/kit/badge'
import { Button } from '@/shared/ui/kit/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/kit/card'

import { prefetchAuctionDetail } from '../api/queries'
import type { AuctionCardViewModel } from '../model/types'
import { AuctionPriceBlock } from './auction-price-block'
import { AuctionStatusBadge } from './auction-status-badge'
import { AuctionTradingStatusBadge } from './auction-trading-status-badge'

const AUC_TYPE_LABEL: Record<(typeof AuctionType)[keyof typeof AuctionType], string> = {
  [AuctionType.REQUEST]: 'Заявочный',
  [AuctionType.UP]: 'На повышение',
  [AuctionType.DOWN]: 'На понижение',
  [AuctionType.FIX_PRICE]: 'Фиксированная цена',
  [AuctionType.UNKNOWN]: 'Неизвестно',
}

export function AuctionCard({ auction }: { auction: AuctionCardViewModel }) {
  const { primaryAction } = auction
  const isDisabled = primaryAction.kind === 'disabled'
  const targetRoute = primaryAction.kind === 'place-bet' || primaryAction.kind === 'change-bet' ? '/auctions/$auctionUuid/bid' : '/auctions/$auctionUuid'

  return (
    <Card onPointerEnter={() => prefetchAuctionDetail(auction.uuid)} data-testid="auction-card">
      <CardHeader>
        <div>
          <div className="text-sm font-medium text-slate-900">№ {auction.cargoNum}</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <Badge variant="neutral">{AUC_TYPE_LABEL[auction.aucType]}</Badge>
            <AuctionStatusBadge status={auction.status} />
            <AuctionTradingStatusBadge status={auction.tradingStatus} />
            {auction.hasMyBet && <Badge variant="info">Моя ставка есть</Badge>}
          </div>
        </div>
        <AuctionPriceBlock current={auction.price.current} perKm={auction.price.perKm} />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <span>{auction.route.loadCity}</span>
          <span aria-hidden className="text-slate-400">
            →
          </span>
          <span>{auction.route.unloadCity}</span>
        </div>
        <div className="mt-1 text-xs text-slate-500">
          {formatDate(auction.loadDate)} — {formatDate(auction.unloadDate)}
        </div>
        <div className="mt-3 text-sm text-slate-700">
          {auction.cargo.name} · {auction.cargo.weight} т · {auction.cargo.volume} м³ · {auction.cargo.bodyType}
        </div>
      </CardContent>
      <CardFooter>
        <Link to="/auctions/$auctionUuid" params={{ auctionUuid: auction.uuid }} className="text-sm text-blue-600 hover:underline">
          Подробнее
        </Link>
        <Button asChild={!isDisabled} disabled={isDisabled} size="sm">
          {isDisabled ? primaryAction.label : <Link to={targetRoute} params={{ auctionUuid: auction.uuid }}>{primaryAction.label}</Link>}
        </Button>
      </CardFooter>
    </Card>
  )
}
