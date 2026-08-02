import { createFileRoute } from '@tanstack/react-router'

import { auctionsListSearchSchema } from '@/features/auctions-filters'
import { AuctionsListPage } from '@/pages/auctions-list'

export const Route = createFileRoute('/auctions/')({
  validateSearch: auctionsListSearchSchema,
  component: AuctionsListPage,
})
