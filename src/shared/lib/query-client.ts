import { QueryClient } from '@tanstack/react-query'

/**
 * Singleton QueryClient. Lives in shared/ (not app/) so shared/lib/wrappers'
 * invalidateQuery can use it directly — invalidation helpers are plain
 * functions, not hooks, so they can't call useQueryClient(). app/ just
 * imports this same instance for the QueryClientProvider.
 */
export const queryClient = new QueryClient()
