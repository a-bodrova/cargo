import { AuctionCard, useAuctionsList } from '@/entities/auction'
import { buildAuctionListRequest, FiltersPanel, useFiltersUiStore, type AuctionsListSearch } from '@/features/auctions-filters'
import { Button } from '@/shared/ui/kit/button'
import { Pagination } from '@/shared/ui/kit/pagination'

import { AuctionsListEmptyState } from './auctions-list-empty-state'
import { AuctionsListErrorState } from './auctions-list-error-state'
import { AuctionsListSkeleton } from './auctions-list-skeleton'

interface AuctionsListWidgetProps {
  search: AuctionsListSearch
  onSearchChange: (patch: Partial<AuctionsListSearch>) => void
}

export function AuctionsListWidget({ search, onSearchChange }: AuctionsListWidgetProps) {
  const { isMobileDrawerOpen, openMobileDrawer, closeMobileDrawer } = useFiltersUiStore()
  const request = buildAuctionListRequest(search)
  const { items, meta, isPending, isError, error, refetch } = useAuctionsList(request)

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <h1 className="text-lg font-semibold text-slate-900">Аукционы</h1>
        <Button size="sm" variant="outline" onClick={isMobileDrawerOpen ? closeMobileDrawer : openMobileDrawer}>
          Фильтры
        </Button>
      </div>
      <h1 className="mb-4 hidden text-lg font-semibold text-slate-900 lg:block">Аукционы</h1>

      {/* Mobile: grid-template-rows 0fr->1fr animates height to content size,
          no measuring needed. overflow-hidden must live directly on the grid
          item — it's what zeroes the item's automatic min-size (min-height:
          auto), which is otherwise content-based and stops the 0fr track
          from ever collapsing. Desktop renders as a separate, unanimated path
          instead of overriding this one with lg: — keeps each breakpoint's
          CSS simple on its own rather than fighting responsive-prefixed resets. */}
      <div className="lg:hidden">
        <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none ${isMobileDrawerOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden">
            <FiltersPanel search={search} onApply={onSearchChange} className="mb-6" />
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <FiltersPanel search={search} onApply={onSearchChange} className="mb-6" />
      </div>

      {isPending ? (
        <AuctionsListSkeleton />
      ) : isError ? (
        <AuctionsListErrorState error={error} onRetry={() => void refetch()} />
      ) : items.length === 0 ? (
        <AuctionsListEmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {items.map((auction) => (
              <AuctionCard key={auction.uuid} auction={auction} />
            ))}
          </div>
          {meta && (
            <div className="mt-6">
              <Pagination currentPage={meta.current_page ?? 1} lastPage={meta.last_page ?? 1} onPageChange={(page) => onSearchChange({ page })} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
