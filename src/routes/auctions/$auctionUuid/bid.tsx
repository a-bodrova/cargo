import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auctions/$auctionUuid/bid')({
  component: PlaceBetRoute,
})

function PlaceBetRoute() {
  const { auctionUuid } = Route.useParams()
  return <div className="p-6 text-slate-500">Форма ставки для {auctionUuid} (в разработке)</div>
}
