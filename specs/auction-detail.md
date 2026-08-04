# Детальная страница аукциона

## Цель

Дать перевозчику полную информацию по одному аукциону — груз, маршрут, условия оплаты, состояние торгов и историю ставок — на основании которой он решает, делать ли ставку. Закрывает требования задания «детальная карточка аукциона» и «история ставок».

## Область

- Роут `/auctions/$auctionUuid` (`pages/auction-detail`); файл маршрута `src/routes/auctions/$auctionUuid/index.tsx` уже существует как заглушка ("в разработке") и подлежит замене на реальный компонент.
- Источники данных: `GET /auctions/{auctionUuid}` (`operationId: getAuction`, схема `AuctionShowResponse`) и `GET /auctions/{auctionUuid}/bets` (`operationId: listBets`, схема `BetListResponse`).
- Сама форма ставки (`/auctions/$auctionUuid/bid`, `operationId: setBet`) — вне области этой спеки, см. `place-bet.md`; здесь CTA только ведёт на этот роут.

## Критерии приёмки

- Данные аукциона загружаются через TanStack Query поверх `getAuction` по `auctionUuid` из параметра роута. Если страница открыта переходом с карточки списка, используется уже прогретый hover-prefetch кэш (`entities/auction/api/queries.ts::prefetchAuctionDetail`), а не повторный запрос.
- Три визуальных состояния для запроса `getAuction`: загрузка (skeleton), ошибка, успех. 404 (`components/responses/NotFound`) рендерит отдельное состояние «аукцион не найден» со ссылкой обратно на `/auctions`, а не пустой детальный вид; прочие ошибки (401/503) — сообщение + действие «повторить», как в списке.
- Шапка показывает `main.cargo_num`, `main.auc_type`, `trading.status`, `trading.status_mobile`, `trading.start_time`/`trading.stop_time`.
- CTA-кнопка использует ту же комбинацию `trading.can_set_bet` × `trading.your.bet`, что и в списке (`entities/auction/model/get-primary-action.ts`), но только 3 состояния, а не 4: «Сделать ставку» (`!your.bet && can_set_bet`) и «Изменить ставку» (`your.bet && can_set_bet`) ведут на `/auctions/$auctionUuid/bid`; при `can_set_bet === false` кнопка задизейблена независимо от `your.bet`. Состояние `view-bets` из списка на детальной странице не нужно — история ставок уже отображена на этой же странице.
- Блок цены показывает `trading.price.{current, min, max, step, price_per_km}`; интерпретация («за рейс» / «за км») зависит от `trading.bid_measurement_type`. При `trading.price.current === null` — нейтральная заглушка, не `0`.
- Блок груза и маршрута показывает `cargo.{price, distance, truck_count, body_type, is_international, car, docs, loading_types}` и для каждого элемента `routes[]` — `op_type` (Loading/Unloading), `start_date`/`end_date`, `location.city_name`, `location.loading_address`, `cargo.{name, weight, volume}`.
- Блок организатора показывает `organizer.organization_name`, `organizer.organization_inn` и контакты из `contacts[]` (`name`, `phone`, `email`).
- Блок оплаты показывает `payment.{form, condition, delay, delay_type, prepay}`.
- Блок допущенных к торгам организаций перечисляет `admitted_organizations[]` (`name`, `inn`, `is_main`).
- История ставок загружается через `listBets` без `all` (по умолчанию только активные) и рендерит по каждому элементу `BetItem`: `contact_name`, `organization_name`, `price_with_vat`/`price_no_vat`, `created_at`, `place`, бейджи `is_win`/`is_counter`. Схема не даёт отдельного поля с числом участников — счётчик «Участников: N» считается на клиенте как количество уникальных `organization_id` среди загруженных ставок.
- Переключатель «показать отменённые» перезапрашивает `listBets` с `all: true` и дополнительно показывает записи с непустым `cancel_reason` и/или `is_rejected === true`, визуально помеченные как отменённые/отклонённые.
- Три визуальных состояния для истории ставок, независимые от состояния `getAuction`: загрузка, пусто (`bets.length === 0` — «ставок пока нет»), ошибка + «повторить».

## Граничные случаи

- `hide_bets_history` существует в схеме дважды — на корне `AuctionShowResponse` и на `trading.hide_bets_history`. Если хотя бы одно из двух `=== true`, вместо истории показывается заглушка «История ставок скрыта организатором», и запрос `listBets` не выполняется.
- `trading.hide_places === true` → поле `place` скрыто в каждой строке истории ставок.
- `trading.no_view_cargo_price === true` → `cargo.price` не отображается.
- `trading.hide_points_address_and_contacts === true` → `routes[].location.loading_address` и `routes[].contact.{name, phone}` не показываются сверх названия города.
- `trading.can_set_bet === false` → CTA задизейблена, а не скрыта (консистентно со списком).
- Nullable-поля `trading.price.{start,current,min,max,step}` и `AuctionShowCargo` (`currency`, `distance`, `temp_from/to` и т.д.) → при `null` скрываются или показывают нейтральную заглушку, не `0` и не текст `"null"`.
- `contacts === []` или `admitted_organizations === []` → соответствующий блок показывает пустое состояние, а не падает.
- `assembly.num`/`assembly.date` оба nullable → блок сборки не рендерится, если оба пусты.
- 401/503 от `getAuction` или `listBets` (`components/responses/Unauthorized`/`ServiceUnavailable`) → единообразная обработка ошибки, как в списке.
