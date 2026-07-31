import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auctions/')({
  component: AuctionsListRoute,
})

function AuctionsListRoute() {
  return <div className="p-6 text-slate-500">Список аукционов (в разработке)</div>
}
