import { QueryClient } from '@tanstack/react-query'

/**
 * Singleton QueryClient. Lives in shared/ (not app/) so shared/lib/wrappers'
 * invalidateQuery can use it directly — invalidation helpers are plain
 * functions, not hooks, so they can't call useQueryClient(). app/ just
 * imports this same instance for the QueryClientProvider.
 *
 * networkMode: 'always' — every request goes through MSW in this same page,
 * there's no real network to be "offline" from.
 *
 * retry: false — TanStack Query's retryer also gates retries on
 * focusManager.isFocused() (document.visibilityState !== 'hidden'), with no
 * per-query way to bypass just that check. In a background/hidden tab a
 * failed query would sit in fetchStatus "paused" forever instead of ever
 * reaching "error". Since our mock has no real transient failures worth
 * retrying through, the simplest correct fix is not to retry at all.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { networkMode: 'always', retry: false },
    mutations: { networkMode: 'always' },
  },
})
