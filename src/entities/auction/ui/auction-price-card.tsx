import { formatCurrency } from '@/shared/lib/format-currency'
import { Card, CardContent } from '@/shared/ui/kit/card'
import { Field } from '@/shared/ui/kit/field'

import { BID_MEASUREMENT_LABEL } from '../model/bid-measurement-label'
import type { AuctionDetailData } from '../model/types'

export function AuctionPriceCard({ trading }: { trading: AuctionDetailData['trading'] }) {
  const unit = BID_MEASUREMENT_LABEL[trading.bid_measurement_type]
  const { current, min, max, step, price_per_km } = trading.price

  return (
    <Card>
      <CardContent>
        <h2 className="text-sm font-semibold text-slate-900">Цена</h2>
        <div className="mt-2 text-2xl font-semibold text-slate-900">{current == null ? 'Цена не определена' : `${formatCurrency(current)} ${unit}`.trim()}</div>
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-700 sm:grid-cols-4">
          <Field label="Мин.">{formatCurrency(min)}</Field>
          <Field label="Макс.">{formatCurrency(max)}</Field>
          <Field label="Шаг">{formatCurrency(step)}</Field>
          <Field label="За км">{formatCurrency(price_per_km)}</Field>
        </div>
      </CardContent>
    </Card>
  )
}
