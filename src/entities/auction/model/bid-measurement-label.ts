import { BidMeasurementType } from '@/shared/api'

export const BID_MEASUREMENT_LABEL: Record<(typeof BidMeasurementType)[keyof typeof BidMeasurementType], string> = {
  [BidMeasurementType.PER_ROUTE]: 'за рейс',
  [BidMeasurementType.PER_KM]: 'за км',
  [BidMeasurementType.UNKNOWN]: '',
}
