import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { AUC_TYPE_LABEL, AuctionStatusBadge, AuctionTradingStatusBadge, getDetailPrimaryAction, useAuctionDetail, type AuctionDetailData } from '@/entities/auction'
import { BidMeasurementType, OperationType, PaymentDelayType } from '@/shared/api'
import { formatCurrency } from '@/shared/lib/format-currency'
import { formatDate } from '@/shared/lib/format-date'
import { Badge } from '@/shared/ui/kit/badge'
import { Button } from '@/shared/ui/kit/button'
import { Card, CardContent, CardHeader } from '@/shared/ui/kit/card'

import { AuctionBetsHistory } from './auction-bets-history'
import { AuctionDetailErrorState } from './auction-detail-error-state'
import { AuctionDetailNotFound } from './auction-detail-not-found'
import { AuctionDetailSkeleton } from './auction-detail-skeleton'

const BID_MEASUREMENT_LABEL: Record<(typeof BidMeasurementType)[keyof typeof BidMeasurementType], string> = {
  [BidMeasurementType.PER_ROUTE]: 'за рейс',
  [BidMeasurementType.PER_KM]: 'за км',
  [BidMeasurementType.UNKNOWN]: '',
}

const PAYMENT_DELAY_LABEL: Record<(typeof PaymentDelayType)[keyof typeof PaymentDelayType], string> = {
  [PaymentDelayType.CALENDAR_DAYS]: 'календарных дней',
  [PaymentDelayType.WORK_DAYS]: 'рабочих дней',
  [PaymentDelayType.UNKNOWN]: 'дней',
}

const OP_TYPE_LABEL: Record<(typeof OperationType)[keyof typeof OperationType], string> = {
  [OperationType.LOADING]: 'Погрузка',
  [OperationType.UNLOADING]: 'Выгрузка',
  [OperationType.UNKNOWN]: 'Неизвестно',
}

export function AuctionDetailWidget({ auctionUuid }: { auctionUuid: string }) {
  const auction = useAuctionDetail(auctionUuid)

  if (auction.isPending) return <AuctionDetailSkeleton />

  if (auction.isError) {
    if (auction.error?.code === 'resource_not_found') return <AuctionDetailNotFound />
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <AuctionDetailErrorState error={auction.error} onRetry={() => void auction.refetch()} fallbackMessage="Не удалось загрузить аукцион." />
      </div>
    )
  }

  const { data } = auction
  if (!data) return null
  const hasAssembly = data.assembly.num !== null || data.assembly.date !== null

  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-6">
      <HeaderCard data={data} />
      <PriceCard trading={data.trading} />
      <CargoCard cargo={data.cargo} hidePrice={data.trading.no_view_cargo_price} />
      <RoutesCard routes={data.routes} hideAddressAndContacts={data.trading.hide_points_address_and_contacts} />
      <OrganizerCard organizer={data.organizer} contacts={data.contacts} />
      <PaymentCard payment={data.payment} />
      <AdmittedOrganizationsCard organizations={data.admitted_organizations} />
      {hasAssembly && <AssemblyCard assembly={data.assembly} />}
      {!auction.hideBetsHistory && <AuctionBetsHistory auctionUuid={auctionUuid} hidePlaces={data.trading.hide_places} />}
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-xs text-slate-400">{label}</div>
      <div>{children}</div>
    </div>
  )
}

function HeaderCard({ data }: { data: AuctionDetailData }) {
  const primaryAction = getDetailPrimaryAction(data.trading)
  const isDisabled = primaryAction.kind === 'disabled'

  return (
    <Card>
      <CardHeader>
        <div>
          <div className="text-sm font-medium text-slate-900">№ {data.main.cargo_num}</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <Badge variant="neutral">{AUC_TYPE_LABEL[data.main.auc_type]}</Badge>
            <AuctionStatusBadge status={data.trading.status} />
            <AuctionTradingStatusBadge status={data.trading.status_mobile} />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Торги: {formatDate(data.trading.start_time)} — {formatDate(data.trading.stop_time)}
          </div>
        </div>
        <Button disabled={isDisabled} asChild={!isDisabled}>
          {isDisabled ? primaryAction.label : (
            <Link to="/auctions/$auctionUuid/bid" params={{ auctionUuid: data.main.order_uid }}>
              {primaryAction.label}
            </Link>
          )}
        </Button>
      </CardHeader>
    </Card>
  )
}

function PriceCard({ trading }: { trading: AuctionDetailData['trading'] }) {
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

function CargoCard({ cargo, hidePrice }: { cargo: AuctionDetailData['cargo']; hidePrice: boolean }) {
  return (
    <Card>
      <CardContent>
        <h2 className="text-sm font-semibold text-slate-900">Груз</h2>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-700 sm:grid-cols-3">
          {!hidePrice && <Field label="Цена груза">{formatCurrency(Number(cargo.price))}</Field>}
          <Field label="Расстояние">{cargo.distance != null ? `${cargo.distance} км` : '—'}</Field>
          <Field label="Кол-во ТС">{cargo.truck_count}</Field>
          <Field label="Тип кузова">{cargo.body_type}</Field>
          <Field label="Международная">{cargo.is_international ? 'Да' : 'Нет'}</Field>
        </div>
        {cargo.car && (
          <div className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-700">
            <span className="text-slate-400">Требования к ТС: </span>
            {cargo.car.type}
            {cargo.car.weight != null && `, ${cargo.car.weight} т`}
            {cargo.car.volume != null && `, ${cargo.car.volume} м³`}
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {cargo.docs.tir && <Badge variant="neutral">TIR</Badge>}
          {cargo.docs.cmr && <Badge variant="neutral">CMR</Badge>}
          {cargo.docs.t1 && <Badge variant="neutral">T1</Badge>}
          {cargo.docs.med && <Badge variant="neutral">Мед. книжка</Badge>}
          {cargo.loading_types.side && <Badge variant="neutral">Боковая загрузка</Badge>}
          {cargo.loading_types.top && <Badge variant="neutral">Верхняя загрузка</Badge>}
          {cargo.loading_types.rear && <Badge variant="neutral">Задняя загрузка</Badge>}
          {cargo.loading_types.full && <Badge variant="neutral">Полная загрузка</Badge>}
        </div>
      </CardContent>
    </Card>
  )
}

function RoutesCard({ routes, hideAddressAndContacts }: { routes: AuctionDetailData['routes']; hideAddressAndContacts: boolean }) {
  return (
    <Card>
      <CardContent>
        <h2 className="text-sm font-semibold text-slate-900">Маршрут</h2>
        <ol className="mt-2 space-y-3">
          {routes.map((point) => (
            <li key={point.row_num} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant={point.op_type === OperationType.LOADING ? 'info' : 'neutral'}>{OP_TYPE_LABEL[point.op_type]}</Badge>
                <span className="font-medium text-slate-900">{point.location.city_name}</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {formatDate(point.start_date)} — {formatDate(point.end_date)}
              </div>
              {!hideAddressAndContacts && point.location.loading_address && <div className="mt-1 text-sm text-slate-700">{point.location.loading_address}</div>}
              {!hideAddressAndContacts && (point.contact.name || point.contact.phone) && (
                <div className="mt-1 text-sm text-slate-700">{[point.contact.name, point.contact.phone].filter(Boolean).join(', ')}</div>
              )}
              <div className="mt-1 text-sm text-slate-600">
                {point.cargo.name} · {point.cargo.weight} т · {point.cargo.volume} м³
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}

function OrganizerCard({ organizer, contacts }: { organizer: AuctionDetailData['organizer']; contacts: AuctionDetailData['contacts'] }) {
  return (
    <Card>
      <CardContent>
        <h2 className="text-sm font-semibold text-slate-900">Организатор</h2>
        <div className="mt-2 text-sm text-slate-700">{organizer.organization_name}</div>
        <div className="text-xs text-slate-500">ИНН {organizer.organization_inn}</div>
        {contacts.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">Контакты не указаны</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {contacts.map((contact, i) => (
              <li key={contact.uid ?? i}>{[contact.name, contact.phone, contact.email].filter(Boolean).join(' · ') || '—'}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

function PaymentCard({ payment }: { payment: AuctionDetailData['payment'] }) {
  return (
    <Card>
      <CardContent>
        <h2 className="text-sm font-semibold text-slate-900">Оплата</h2>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-700 sm:grid-cols-4">
          <Field label="Форма">{payment.form}</Field>
          <Field label="Отсрочка">{payment.delay != null ? `${payment.delay} ${PAYMENT_DELAY_LABEL[payment.delay_type]}` : '—'}</Field>
          <Field label="Аванс">{payment.prepay ?? '—'}</Field>
          <Field label="Условие">{payment.condition ?? '—'}</Field>
        </div>
      </CardContent>
    </Card>
  )
}

function AdmittedOrganizationsCard({ organizations }: { organizations: AuctionDetailData['admitted_organizations'] }) {
  return (
    <Card>
      <CardContent>
        <h2 className="text-sm font-semibold text-slate-900">Допущенные организации</h2>
        {organizations.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">Организации не допущены</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {organizations.map((org) => (
              <li key={org.id} className="flex items-center gap-2">
                <span>{org.name}</span>
                <span className="text-xs text-slate-400">ИНН {org.inn}</span>
                {org.is_main && <Badge variant="info">Основная</Badge>}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

function AssemblyCard({ assembly }: { assembly: AuctionDetailData['assembly'] }) {
  return (
    <Card>
      <CardContent>
        <h2 className="text-sm font-semibold text-slate-900">Сборный груз</h2>
        <div className="mt-2 text-sm text-slate-700">
          {assembly.num && <span>№ {assembly.num}</span>}
          {assembly.date && <span className="ml-2 text-slate-500">{formatDate(assembly.date)}</span>}
        </div>
      </CardContent>
    </Card>
  )
}
