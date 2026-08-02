import { useEffect, useState } from 'react'

import { AuctionType, TradingStatus } from '@/shared/api'
import { Button } from '@/shared/ui/kit/button'
import { Input } from '@/shared/ui/kit/input'

import type { AuctionsListSearch } from '../model/filters.schema'
import { CitySelect } from './city-select'

const AUC_TYPE_OPTIONS = [
  { value: AuctionType.REQUEST, label: 'Заявочный' },
  { value: AuctionType.UP, label: 'На повышение' },
  { value: AuctionType.DOWN, label: 'На понижение' },
  { value: AuctionType.FIX_PRICE, label: 'Фиксированная цена' },
]

const TRADING_STATUS_OPTIONS = [
  { value: TradingStatus.NOT_PARTICIPATING, label: 'Не участвую' },
  { value: TradingStatus.LEADING, label: 'Лидирую' },
  { value: TradingStatus.LOSING, label: 'Перебита' },
  { value: TradingStatus.WINNER, label: 'Победитель' },
  { value: TradingStatus.CONFIRMED, label: 'Подтверждена' },
  { value: TradingStatus.ON_PENDING, label: 'На рассмотрении' },
  { value: TradingStatus.CHOOSING_WINNER, label: 'Выбор победителя' },
  { value: TradingStatus.ACCEPTED, label: 'Принята' },
]

/** AuctionStatus, numeric codes as used by AuctionListRequest.statuses (see shared/mocks/handlers/auctions.list.ts). */
const AUCTION_STATUS_OPTIONS = [
  { value: 1, label: 'Планирование' },
  { value: 2, label: 'Идут торги' },
  { value: 3, label: 'Определение победителя' },
  { value: 4, label: 'Ожидание сделки' },
  { value: 5, label: 'В работе' },
  { value: 6, label: 'Завершён' },
  { value: 7, label: 'Остановлен' },
  { value: 8, label: 'Отменён' },
]

function getMultiSelectValues(event: React.ChangeEvent<HTMLSelectElement>): string[] {
  return Array.from(event.target.selectedOptions, (option) => option.value)
}

interface FiltersPanelProps {
  search: AuctionsListSearch
  onApply: (patch: Partial<AuctionsListSearch>) => void
  className?: string
}

export function FiltersPanel({ search, onApply, className }: FiltersPanelProps) {
  const [draft, setDraft] = useState(search)

  // useSearch() re-parses via zod on every render, so `search` is a new
  // object reference each time even when its content is unchanged — keying
  // this effect on the reference itself would resync (and so discard) local
  // edits on every keystroke. Key on the serialized content instead, so this
  // only fires when the URL's actual values change (e.g. back/forward nav).
  const searchKey = JSON.stringify(search)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setDraft(search), [searchKey])

  return (
    <form
      className={className}
      onSubmit={(event) => {
        event.preventDefault()
        onApply({ ...draft, page: 1 })
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-700">Номер заявки</span>
          <Input value={draft.cargo_num ?? ''} onChange={(e) => setDraft((d) => ({ ...d, cargo_num: e.target.value || undefined }))} placeholder="00000001059" />
        </label>

        <CitySelect label="Город погрузки" value={draft.load_city} onChange={(city) => setDraft((d) => ({ ...d, load_city: city }))} />
        <CitySelect label="Город выгрузки" value={draft.unload_city} onChange={(city) => setDraft((d) => ({ ...d, unload_city: city }))} />

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-700">Тип аукциона</span>
          <select
            multiple
            value={draft.auc_type ?? []}
            onChange={(e) => setDraft((d) => ({ ...d, auc_type: getMultiSelectValues(e) as typeof d.auc_type }))}
            className="h-24 cursor-pointer rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900"
          >
            {AUC_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-700">Мой статус</span>
          <select
            multiple
            value={draft.status ?? []}
            onChange={(e) => setDraft((d) => ({ ...d, status: getMultiSelectValues(e) as typeof d.status }))}
            className="h-24 cursor-pointer rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900"
          >
            {TRADING_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-700">Статус аукциона</span>
          <select
            multiple
            value={(draft.statuses ?? []).map(String)}
            onChange={(e) => setDraft((d) => ({ ...d, statuses: getMultiSelectValues(e).map(Number) }))}
            className="h-24 cursor-pointer rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900"
          >
            {AUCTION_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-700">Погрузка от</span>
          <Input type="date" value={draft.load_date_from ?? ''} onChange={(e) => setDraft((d) => ({ ...d, load_date_from: e.target.value || undefined }))} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-700">Погрузка до</span>
          <Input type="date" value={draft.load_date_to ?? ''} onChange={(e) => setDraft((d) => ({ ...d, load_date_to: e.target.value || undefined }))} />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-700">Цена от</span>
          <Input type="number" min={0} value={draft.current_price_from ?? ''} onChange={(e) => setDraft((d) => ({ ...d, current_price_from: e.target.value ? Number(e.target.value) : undefined }))} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-700">Цена до</span>
          <Input type="number" min={0} value={draft.current_price_to ?? ''} onChange={(e) => setDraft((d) => ({ ...d, current_price_to: e.target.value ? Number(e.target.value) : undefined }))} />
        </label>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={draft.is_available ?? false} onChange={(e) => setDraft((d) => ({ ...d, is_available: e.target.checked || undefined }))} />
          Только доступные для ставки
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={draft.is_bidder ?? false} onChange={(e) => setDraft((d) => ({ ...d, is_bidder: e.target.checked || undefined }))} />
          Только где я участвовал
        </label>
      </div>

      <div className="mt-4 flex gap-2">
        <Button type="submit" size="sm">
          Применить
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const reset: AuctionsListSearch = { page: 1, per_page: search.per_page }
            setDraft(reset)
            onApply(reset)
          }}
        >
          Сбросить
        </Button>
      </div>
    </form>
  )
}
