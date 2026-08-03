import type { BetItem } from '@/shared/api'
import type { DeepRequired } from '@/shared/lib/deep-required'
import { formatCurrency } from '@/shared/lib/format-currency'
import { formatDate } from '@/shared/lib/format-date'
import { Badge } from '@/shared/ui/kit/badge'

export function BetRow({ bet, hidePlaces }: { bet: DeepRequired<BetItem>; hidePlaces: boolean }) {
  const isCancelled = bet.cancel_reason !== ''
  const isRejected = bet.is_rejected === true

  return (
    <li className="flex items-center justify-between gap-3 border-b border-slate-100 py-3 last:border-0">
      <div>
        <div className="text-sm font-medium text-slate-900">{bet.organization_name || '—'}</div>
        <div className="text-xs text-slate-500">
          {bet.contact_name || '—'} · {formatDate(bet.created_at)}
        </div>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {bet.is_win && <Badge variant="success">Победитель</Badge>}
          {bet.is_counter && <Badge variant="info">Встречная</Badge>}
          {isRejected && <Badge variant="danger">Отклонена</Badge>}
          {isCancelled && <Badge variant="neutral">{bet.cancel_reason ? `Отменена: ${bet.cancel_reason}` : 'Отменена'}</Badge>}
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-slate-900">{formatCurrency(bet.price_with_vat)}</div>
        <div className="text-xs text-slate-500">{formatCurrency(bet.price_no_vat)} без НДС</div>
        {!hidePlaces && bet.place != null && <div className="mt-1 text-xs text-slate-500">Место: {bet.place}</div>}
      </div>
    </li>
  )
}
