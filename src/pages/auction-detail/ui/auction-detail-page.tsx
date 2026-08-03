import { getRouteApi } from '@tanstack/react-router'

import { AuctionDetailWidget } from '@/widgets/auction-detail'

const routeApi = getRouteApi('/auctions/$auctionUuid/')

export function AuctionDetailPage() {
  const { auctionUuid } = routeApi.useParams()
  return <AuctionDetailWidget auctionUuid={auctionUuid} />
}
