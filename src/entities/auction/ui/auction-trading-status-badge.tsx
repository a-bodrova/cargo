import { TradingStatus } from '@/shared/api'
import { Badge, type BadgeProps } from '@/shared/ui/kit/badge'

const CONFIG: Record<(typeof TradingStatus)[keyof typeof TradingStatus], { label: string; variant: BadgeProps['variant'] }> = {
  [TradingStatus.NOT_PARTICIPATING]: { label: 'Не участвую', variant: 'neutral' },
  [TradingStatus.LEADING]: { label: 'Лидирую', variant: 'success' },
  [TradingStatus.LOSING]: { label: 'Перебита', variant: 'warning' },
  [TradingStatus.ON_PENDING]: { label: 'На рассмотрении', variant: 'neutral' },
  [TradingStatus.CONFIRMED]: { label: 'Подтверждена', variant: 'success' },
  [TradingStatus.CHOOSING_WINNER]: { label: 'Выбор победителя', variant: 'warning' },
  [TradingStatus.WINNER]: { label: 'Победитель', variant: 'success' },
  [TradingStatus.ACCEPTED]: { label: 'Принята', variant: 'success' },
  [TradingStatus.UNKNOWN]: { label: 'Неизвестно', variant: 'neutral' },
}

export function AuctionTradingStatusBadge({ status }: { status: (typeof TradingStatus)[keyof typeof TradingStatus] }) {
  if (status === TradingStatus.NOT_PARTICIPATING) return null
  const { label, variant } = CONFIG[status] ?? CONFIG[TradingStatus.UNKNOWN]
  return <Badge variant={variant}>{label}</Badge>
}
