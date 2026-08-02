import { formatCurrency } from '@/shared/lib/format-currency'

export function AuctionPriceBlock({ current, perKm }: { current: number | null; perKm: number | null }) {
  return (
    <div className="text-right">
      <div className="text-lg font-semibold text-slate-900">{formatCurrency(current)}</div>
      {perKm != null && <div className="text-xs text-slate-500">{formatCurrency(perKm)}/км</div>}
    </div>
  )
}
