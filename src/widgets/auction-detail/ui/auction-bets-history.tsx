import { useState } from 'react'

import { BetRow, useAuctionBets } from '@/entities/bet'
import { Card, CardContent } from '@/shared/ui/kit/card'
import { Skeleton } from '@/shared/ui/kit/skeleton'

import { AuctionDetailErrorState } from './auction-detail-error-state'

export function AuctionBetsHistory({ auctionUuid, hidePlaces }: { auctionUuid: string; hidePlaces: boolean }) {
  const [showCancelled, setShowCancelled] = useState(false)
  const bets = useAuctionBets(auctionUuid, showCancelled)
  const participantCount = new Set(bets.items.map((bet) => bet.organization_id)).size

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">История ставок</h2>
            {!bets.isPending && !bets.isError && <p className="text-xs text-slate-500">Участников: {participantCount}</p>}
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={showCancelled} onChange={(e) => setShowCancelled(e.target.checked)} />
            Показать отменённые
          </label>
        </div>

        {bets.isPending ? (
          <div className="mt-3 space-y-2" aria-busy="true" aria-label="Загрузка истории ставок">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : bets.isError ? (
          <div className="mt-3">
            <AuctionDetailErrorState error={bets.error} onRetry={() => void bets.refetch()} fallbackMessage="Не удалось загрузить историю ставок." />
          </div>
        ) : bets.items.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Ставок пока нет</p>
        ) : (
          <ul className="mt-3">
            {bets.items.map((bet) => (
              <BetRow key={bet.id} bet={bet} hidePlaces={hidePlaces} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
