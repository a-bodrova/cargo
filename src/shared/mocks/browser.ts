import { setupWorker } from 'msw/browser'

import { resetMockDb } from './db/seed'
import { handlers } from './handlers'

resetMockDb()

export const worker = setupWorker(...handlers)
