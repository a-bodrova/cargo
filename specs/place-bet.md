# Форма ставки

## Цель

Дать перевозчику возможность сделать или изменить ставку в аукционе, с проверкой правил шага/направления цены на клиенте до отправки на сервер. Закрывает требование задания «форма ставки» — CTA на детальной странице (`auction-detail.md`) уже ведёт на этот роут, сама форма вынесена в эту спеку.

## Область

- Роут `/auctions/$auctionUuid/bid` (`pages/place-bet`); файл маршрута `src/routes/auctions/$auctionUuid/bid.tsx` уже существует как заглушка ("в разработке") и подлежит замене на реальный компонент.
- Отправка ставки — `POST /auctions/{auctionUuid}/bets` (`operationId: setBet`, тело `SetBetRequest{price}`).
- Состояние торгов для формы читается тем же запросом, что и на детальной странице — `GET /auctions/{auctionUuid}` (`operationId: getAuction`, схема `AuctionShowResponse`). История ставок (`listBets`) в эту спеку не входит, см. `auction-detail.md`.

## Критерии приёмки

- Данные для формы (`main.auc_type`, `trading.can_set_bet`, `trading.price.{current,min,max,step,available}`, `trading.your.{bet,last_bet}`, `trading.bid_measurement_type`) читаются через тот же TanStack Query ключ `getAuction`, что и на детальной странице — при переходе с детальной страницы кэш уже тёплый, повторного запроса не происходит.
- Три визуальных состояния для `getAuction`: загрузка (skeleton), ошибка (404 — «аукцион не найден» со ссылкой на `/auctions`, прочие — сообщение + «повторить»), успех. Форма рендерится только в успешном состоянии.
- При `trading.can_set_bet === false` форма не рендерится вообще (не задизейбленная форма, а её отсутствие) — вместо неё сообщение о недоступности ставки и ссылка назад на `/auctions/$auctionUuid`.
- Единственное поле формы соответствует `SetBetRequest.price`; подпись меняется по `trading.bid_measurement_type` (`PerRoute` → «за рейс», `PerKm` → «за км»), как в `PriceCard` детальной страницы (`widgets/auction-detail/ui/auction-detail-widget.tsx`).
- Поле — нативный `<input type="number">` с атрибутами `min`/`max`/`step`, выставленными из `trading.price.{min,max,step}` там, где они не `null`. Под полем — текстовая подсказка с `trading.price.available` и `trading.price.step` (там, где они не `null`), т.к. атрибуты `min`/`max`/`step` сами по себе не видны пользователю до попытки невалидного ввода.
- При `trading.your.bet === true` поле предзаполняется значением `trading.your.last_bet`; иначе поле пустое.
- Клиентская Zod-схема (RHF + `@hookform/resolvers`) требует `price > 0` до отправки.
- Клиентская проверка направления цены по `main.auc_type`, зеркалящая серверную (`shared/mocks/handlers/auctions.bets.ts::validateBet`), выполняется там, где нужные поля цены не `null`:
  - `Down` — `price <= trading.price.current - trading.price.step`;
  - `Up` — `price > trading.price.current`;
  - `FixPrice` — `price === trading.price.available`;
  - `Request` — направленной проверки нет, только `price > 0`.
- Кнопка отправки блокируется, пока запрос `setBet` не завершён (`useSetBet` из `shared/lib/api/generated/mutations.ts`, состояние `isPending`), чтобы исключить повторную отправку по двойному клику.
- Успешная отправка (`200`; тело ответа не типизировано схемой и не используется для обновления UI) — инвалидируются `getAuction`, `listAuctions` и `listBets` (`shared/lib/api/generated/invalidations.ts`), показывается успешный тост (`useToast` из `app/providers/toast-provider.tsx`) и происходит переход на `/auctions/$auctionUuid`.
- Ответ `422` (`ValidationProblem.errors[]`) — каждый `ValidationError.field` сопоставляется с полем формы через `setError` (`price` → поле цены), `message` показывается под полем как есть, без переформулирования.
- Ответы `401`/`503` при отправке (`Unauthorized`/`ServiceUnavailable`) показываются тостом-ошибкой, форма остаётся заполненной для повторной отправки; `404` (`NotFound`, например аукцион удалён между открытием формы и отправкой) — то же состояние «аукцион не найден», что и при ошибке загрузки.
- Ссылка/кнопка «Отмена» ведёт на `/auctions/$auctionUuid` без отправки формы.

## Граничные случаи

- `trading.price.current === null` (например, `auc_type: Request` до появления цены, либо все ценовые поля `null`, как в seed-аукционе `auction09`) → направленная проверка и подсказки на основе `current` не применяются.
- `main.auc_type === 'FixPrice'` и `trading.price.step === null` (seed-аукцион `auction05`) → атрибут `step` у инпута не выставляется; направленная проверка — только на равенство `available`.
- `main.auc_type === 'Up'` и `trading.price.max === null` (seed-аукцион `auction04`) → атрибут `max` у инпута не выставляется.
- `trading.your.bet === true`, но `trading.your.last_bet === null` → поле не предзаполняется (пустое), а не `0`.
- 404 от `getAuction` (несуществующий `auctionUuid`, прямой переход по ссылке) → форма не рендерится, показывается «аукцион не найден» вместо падения.
- `trading.can_set_bet` меняется на `false` между открытием формы и отправкой (гонка) → сервер вернёт `422` с `code: bet_not_allowed`, что покрыто общим сценарием обработки 422, отдельного клиентского случая не требуется.
