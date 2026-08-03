import { formatDate } from '@/shared/lib/format-date'
import { Badge } from '@/shared/ui/kit/badge'

import { AUC_TYPE_LABEL } from '../model/auc-type-label'
import type { AuctionDetailData } from '../model/types'
import { AuctionStatusBadge } from './auction-status-badge'
import { AuctionTradingStatusBadge } from './auction-trading-status-badge'

export function AuctionSummary({ main, trading }: { main: AuctionDetailData['main']; trading: AuctionDetailData['trading'] }) {
  return (
    <div>
      <div className="text-sm font-medium text-slate-900">№ {main.cargo_num}</div>
      <div className="mt-1 flex flex-wrap gap-1.5">
        <Badge variant="neutral">{AUC_TYPE_LABEL[main.auc_type]}</Badge>
        <AuctionStatusBadge status={trading.status} />
        <AuctionTradingStatusBadge status={trading.status_mobile} />
      </div>
      <div className="mt-2 text-xs text-slate-500">
        Торги: {formatDate(trading.start_time)} — {formatDate(trading.stop_time)}
      </div>
    </div>
  )
}
