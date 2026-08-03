import { AuctionType } from '@/shared/api'

export const AUC_TYPE_LABEL: Record<(typeof AuctionType)[keyof typeof AuctionType], string> = {
  [AuctionType.REQUEST]: 'Заявочный',
  [AuctionType.UP]: 'На повышение',
  [AuctionType.DOWN]: 'На понижение',
  [AuctionType.FIX_PRICE]: 'Фиксированная цена',
  [AuctionType.UNKNOWN]: 'Неизвестно',
}
