import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { ToastProvider } from '@/app/providers/toast-provider'
import { queryClient } from '@/shared/lib/query-client'

function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Outlet />
      </ToastProvider>
      {import.meta.env.DEV && (
        <>
          <ReactQueryDevtools initialIsOpen={false} />
          <TanStackRouterDevtools />
        </>
      )}
    </QueryClientProvider>
  )
}

export const Route = createRootRoute({ component: RootLayout })
