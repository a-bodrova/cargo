import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auctions/$auctionUuid/')({
  component: AuctionDetailRoute,
})

function AuctionDetailRoute() {
  const { auctionUuid } = Route.useParams()
  return <div className="p-6 text-slate-500">Детальная страница аукциона {auctionUuid} (в разработке)</div>
}
