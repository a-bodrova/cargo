import { ENABLE_MSW } from '@/shared/config/env'

/** Awaited in main.tsx before the first render so no request races the worker's startup. */
export async function enableMocking() {
  if (!ENABLE_MSW) return

  const { worker } = await import('@/shared/mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}
