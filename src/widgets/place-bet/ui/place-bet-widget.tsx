import { Link } from '@tanstack/react-router'
import { useState } from 'react'

import { AuctionPriceCard, AuctionSummary, useAuctionDetail } from '@/entities/auction'
import type { ProblemDetail } from '@/shared/api'
import { Button } from '@/shared/ui/kit/button'
import { Card, CardContent, CardHeader } from '@/shared/ui/kit/card'
import { Skeleton } from '@/shared/ui/kit/skeleton'

import { BetForm } from './bet-form'

export function PlaceBetWidget({ auctionUuid }: { auctionUuid: string }) {
  const [notFoundOnSubmit, setNotFoundOnSubmit] = useState(false)
  const auction = useAuctionDetail(auctionUuid)

  if (auction.isPending) return <PlaceBetSkeleton />

  if (auction.isError) {
    if (auction.error?.code === 'resource_not_found') return <NotFoundState />
    return (
      <div className="mx-auto max-w-md px-4 py-6">
        <ErrorState error={auction.error} onRetry={() => void auction.refetch()} />
      </div>
    )
  }

  if (notFoundOnSubmit) return <NotFoundState />

  const { data } = auction
  if (!data) return null

  if (!data.trading.can_set_bet) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-sm font-medium text-slate-700">Ставка в этом аукционе недоступна</p>
          <Link
            to="/auctions/$auctionUuid"
            params={{ auctionUuid }}
            className="mt-2 inline-block text-sm text-blue-600 hover:underline"
          >
            Вернуться к аукциону
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-6">
      <Card>
        <CardHeader>
          <AuctionSummary main={data.main} trading={data.trading} />
        </CardHeader>
      </Card>
      <AuctionPriceCard trading={data.trading} />
      <BetForm
        auctionUuid={auctionUuid}
        aucType={data.main.auc_type}
        trading={data.trading}
        onNotFound={() => setNotFoundOnSubmit(true)}
      />
    </div>
  );
}

function PlaceBetSkeleton() {
  return (
    <div className="mx-auto max-w-md space-y-4 px-4 py-6" aria-busy="true" aria-label="Загрузка данных аукциона">
      <Card>
        <CardHeader>
          <div className="w-full space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-48" />
          </div>
        </CardHeader>
      </Card>
      <Card>
        <CardContent>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-10 w-24" />
        </CardContent>
      </Card>
    </div>
  )
}

function ErrorState({ error, onRetry }: { error: ProblemDetail | null; onRetry: () => void }) {
  const message = error && 'message' in error ? error.message : 'Не удалось загрузить аукцион.'

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 py-16 text-center">
      <p className="text-sm font-medium text-red-900">{message}</p>
      <Button className="mt-4" size="sm" variant="outline" onClick={onRetry}>
        Повторить
      </Button>
    </div>
  )
}

function NotFoundState() {
  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="rounded-lg border border-dashed border-slate-300 py-16 text-center">
        <p className="text-sm font-medium text-slate-700">Аукцион не найден</p>
        <Link to="/auctions" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
          Вернуться к списку аукционов
        </Link>
      </div>
    </div>
  )
}
