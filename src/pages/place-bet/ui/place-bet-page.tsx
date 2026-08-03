import { getRouteApi } from '@tanstack/react-router'

import { PlaceBetWidget } from '@/widgets/place-bet'

const routeApi = getRouteApi('/auctions/$auctionUuid/bid')

export function PlaceBetPage() {
  const { auctionUuid } = routeApi.useParams()
  return <PlaceBetWidget auctionUuid={auctionUuid} />
}
