import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

import { useToast } from '@/app/providers/toast-provider'
import { BID_MEASUREMENT_LABEL, getDetailPrimaryAction, type AuctionDetailData } from '@/entities/auction'
import { invalidateGetAuction, invalidateListAuctions, invalidateListBets, useSetBet } from '@/shared/lib/api/generated'
import { Button } from '@/shared/ui/kit/button'
import { Card, CardContent } from '@/shared/ui/kit/card'
import { Input } from '@/shared/ui/kit/input'

import { createBetSchema, type BetFormValues } from '../model/bet-schema'

interface BetFormProps {
  auctionUuid: string
  aucType: AuctionDetailData['main']['auc_type']
  trading: AuctionDetailData['trading']
  onNotFound: () => void
}

export function BetForm({ auctionUuid, aucType, trading, onNotFound }: BetFormProps) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { price } = trading

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<BetFormValues>({
    resolver: zodResolver(createBetSchema(aucType, price)),
    defaultValues: { price: trading.your.bet === true ? (trading.your.last_bet ?? undefined) : undefined },
  })

  // useSetBet() takes no setup-time options: path/body aren't known until submit, and the
  // wrapper types `options` as an intersection with the full (required) mutation variables —
  // so onSuccess/onError go to `mutate()`'s own per-call callbacks instead of the hook.
  const setBet = useSetBet()

  function onSubmit(values: BetFormValues) {
    setBet.mutate(
      { path: { auctionUuid }, body: { price: values.price } },
      {
        onSuccess: () => {
          invalidateGetAuction({ path: { auctionUuid } })
          invalidateListAuctions()
          invalidateListBets({ path: { auctionUuid } })
          showToast({ title: 'Ставка принята', variant: 'success' })
          void navigate({ to: '/auctions/$auctionUuid', params: { auctionUuid } })
        },
        onError: (error) => {
          if ('errors' in error) {
            for (const fieldError of error.errors) setError(fieldError.field as 'price', { type: 'server', message: fieldError.message })
            return
          }
          if (error.code === 'resource_not_found') {
            onNotFound()
            return
          }
          showToast({ title: error.message, variant: 'error' })
        },
      },
    )
  }

  const unit = BID_MEASUREMENT_LABEL[trading.bid_measurement_type]
  const title = getDetailPrimaryAction(trading).label

  return (
    <Card>
      <CardContent>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        <form className="mt-4 space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-700">{`Ваша ставка ${unit}`.trim()}</span>
            <Input type="number" min={price.min ?? undefined} max={price.max ?? undefined} step={price.step ?? undefined} {...register('price', { valueAsNumber: true })} />
            {errors.price && <span className="text-xs text-red-600">{errors.price.message}</span>}
          </label>

          <div className="flex gap-2">
            <Button type="submit" disabled={setBet.isPending}>
              {setBet.isPending ? 'Отправка…' : 'Отправить'}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link to="/auctions/$auctionUuid" params={{ auctionUuid }}>
                Отмена
              </Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
