import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/app/styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="flex min-h-screen items-center justify-center text-slate-500">
      cargo
    </div>
  </StrictMode>,
)
