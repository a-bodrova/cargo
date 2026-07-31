import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/app/styles/index.css'
import { enableMocking } from '@/app/mocks/enable-mocking'
import { router } from '@/app/router'

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
})
