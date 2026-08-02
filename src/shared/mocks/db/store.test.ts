import { describe, expect, it } from 'vitest'

import { createDbAuction } from './factories'
import { toListItem } from './store'

describe('toListItem', () => {
  it('omits route point address when hide_points_address_and_contacts is true', () => {
    const db = createDbAuction({ trading: { hide_points_address_and_contacts: true } })

    const item = toListItem(db)

    expect(item.route?.load?.address).toBeUndefined()
    expect(item.route?.unload?.address).toBeUndefined()
  })

  it('includes route point address when hide_points_address_and_contacts is false', () => {
    const db = createDbAuction({ trading: { hide_points_address_and_contacts: false } })

    const item = toListItem(db)

    expect(item.route?.load?.address).toBe('Транспортная 9')
    expect(item.route?.unload?.address).toBe('Складская 1')
  })
})
