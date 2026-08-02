# Список аукционов

## Цель

Дать перевозчику возможность просматривать и фильтровать грузовые аукционы, в которых он может участвовать, чтобы найти подходящий груз, не пролистывая весь маркетплейс. Закрывает требование задания «список аукционов».

## Область

- Роут `/auctions` (`pages/auctions-list`).
- Источник данных — `POST /auctions/list` (`operationId: listAuctions`).

## Критерии приёмки

- Данные загружаются через TanStack Query поверх `listAuctions`; тело запроса соответствует `AuctionListRequest` — как минимум `page`, `per_page`.
- Пагинация отражает `AuctionListResponseBase.meta` (`current_page`, `last_page`, `per_page`, `total`); смена страницы обновляет `AuctionListRequest.page`.
- Три различных визуальных состояния: загрузка (skeleton), пусто (`meta.total === 0`), ошибка (ошибка запроса + действие «повторить»).
- Фильтры, все отображаются 1:1 на поля `AuctionListRequest` и синхронизируются с URL search params:
  - `cargo_num` (строка)
  - `status` (массив, enum `TradingStatus`, включая значения только для списка — `OnPending`/`ChoosingWinner`/`Accepted`) и/или `statuses` (числовые коды `AuctionStatus`)
  - `auc_type` (массив, `Request`/`Up`/`Down`/`FixPrice`)
  - `load_city` / `unload_city` (строка, из мокового справочника городов — `shared/config/cities.ts`)
  - `load_date_from` / `load_date_to` (диапазон дат)
  - `is_available` (булево)
  - `is_bidder` (булево)
  - `current_price_from` / `current_price_to` (числовой диапазон)
- Search params парсятся и валидируются Zod-схемой; для каждого поля есть безопасное значение по умолчанию (`.catch()`) — некорректный URL не должен приводить к падению.
- Наведение/pointer-intent на карточку префетчит запрос детальной карточки этого аукциона (`getAuction`) до клика пользователя.
- Раскладка адаптируется между десктопом (панель фильтров) и мобильной версией (drawer с фильтрами).
- Каждая карточка `AuctionListItem` показывает: `main.cargo_num`, `main.auc_type`, `trading.status`, `trading.status_mobile`, `route.load`→`route.unload`, даты погрузки/выгрузки, `cargo.{name,weight,volume,body_type}`, `trading.price.current`, `main.price_per_km`, `trading.your.bet` (флаг наличия своей ставки), а также основное действие, определяемое комбинацией `trading.can_set_bet` × `trading.your.bet` × `trading.status_mobile` (Сделать ставку / Изменить ставку / Смотреть ставки / недоступно).

## Граничные случаи

- `trading.can_set_bet === false` → основное действие задизейблено, а не скрыто.
- `trading.hide_points_address_and_contacts === true` → карточка не должна раскрывать адрес погрузки/выгрузки сверх названия города.
- `trading.price === null` (например, аукционы типа `Request` до появления цены) → блок цены показывает нейтральную заглушку, а не `0` и не падает.
- `per_page` за пределами практического диапазона схемы → обрезается на клиенте до отправки, согласно фолбэку схемы search params.
- Ноль результатов при валидной комбинации фильтров → пустое состояние.
- Некорректная/мусорная query-строка (например, `?page=abc&is_available=maybe`) → откат к значениям по умолчанию.
