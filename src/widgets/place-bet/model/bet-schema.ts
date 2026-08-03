import { z } from 'zod'

import { AuctionType, type AuctionShowTradingPrice } from '@/shared/api'
import type { DeepRequired } from '@/shared/lib/deep-required'

type AucType = (typeof AuctionType)[keyof typeof AuctionType]
type Price = Pick<DeepRequired<AuctionShowTradingPrice>, 'current' | 'step' | 'available'>

/** Mirrors shared/mocks/handlers/auctions.bets.ts::validateBet's direction check, field for field. */
function getDirectionError(aucType: AucType, price: Price, value: number): string | null {
  if (aucType === AuctionType.DOWN && price.current !== null && price.step !== null && value > price.current - price.step) {
    return `Ставка должна быть ниже текущей минимум на шаг (${price.step}).`
  }
  if (aucType === AuctionType.UP && price.current !== null && value <= price.current) {
    return 'Ставка должна превышать текущую цену.'
  }
  if (aucType === AuctionType.FIX_PRICE && price.available !== null && value !== price.available) {
    return `Цена должна быть равна доступной (${price.available}).`
  }
  return null
}

export function createBetSchema(aucType: AucType, price: Price) {
  return z.object({
    price: z
      .number({ invalid_type_error: 'Введите цену.' })
      .gt(0, 'Цена должна быть больше 0.')
      .superRefine((value, ctx) => {
        if (!(value > 0)) return
        const message = getDirectionError(aucType, price, value)
        if (message) ctx.addIssue({ code: z.ZodIssueCode.custom, message })
      }),
  })
}

export type BetFormValues = z.infer<ReturnType<typeof createBetSchema>>
