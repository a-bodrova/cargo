import { AuctionStatus } from '@/shared/api'
import { Badge, type BadgeProps } from '@/shared/ui/kit/badge'

const CONFIG: Record<(typeof AuctionStatus)[keyof typeof AuctionStatus], { label: string; variant: BadgeProps['variant'] }> = {
  [AuctionStatus.PLANNING]: { label: 'Планирование', variant: 'neutral' },
  [AuctionStatus.AUCTION]: { label: 'Идут торги', variant: 'info' },
  [AuctionStatus.DETERMINATE_WINNER]: { label: 'Определение победителя', variant: 'warning' },
  [AuctionStatus.WAIT_DEAL]: { label: 'Ожидание сделки', variant: 'warning' },
  [AuctionStatus.IN_PROGRESS]: { label: 'В работе', variant: 'info' },
  [AuctionStatus.FINISHED]: { label: 'Завершён', variant: 'success' },
  [AuctionStatus.STOPPED]: { label: 'Остановлен', variant: 'neutral' },
  [AuctionStatus.CANCELED]: { label: 'Отменён', variant: 'danger' },
  [AuctionStatus.UNKNOWN]: { label: 'Неизвестно', variant: 'neutral' },
}

export function AuctionStatusBadge({ status }: { status: (typeof AuctionStatus)[keyof typeof AuctionStatus] }) {
  const { label, variant } = CONFIG[status] ?? CONFIG[AuctionStatus.UNKNOWN]
  return <Badge variant={variant}>{label}</Badge>
}
