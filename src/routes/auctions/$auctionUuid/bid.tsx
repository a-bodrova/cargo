import { createFileRoute } from '@tanstack/react-router'

import { PlaceBetPage } from '@/pages/place-bet'

export const Route = createFileRoute('/auctions/$auctionUuid/bid')({
  component: PlaceBetPage,
})
