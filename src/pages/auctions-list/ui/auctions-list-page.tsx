import { getRouteApi } from '@tanstack/react-router'

import { AuctionsListWidget } from '@/widgets/auctions-list'

const routeApi = getRouteApi('/auctions/')

export function AuctionsListPage() {
  const search = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  return <AuctionsListWidget search={search} onSearchChange={(patch) => void navigate({ search: (prev) => ({ ...prev, ...patch }) })} />
}
