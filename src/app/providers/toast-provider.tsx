import * as Toast from '@radix-ui/react-toast'
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

interface ToastMessage {
  id: number
  title: string
  description?: string
  variant: 'success' | 'error'
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

let nextId = 1

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    setMessages((prev) => [...prev, { ...toast, id: nextId++ }])
  }, [])

  const dismiss = useCallback((id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast.Provider swipeDirection="right">
        {children}
        {messages.map((message) => (
          <Toast.Root
            key={message.id}
            duration={4000}
            onOpenChange={(open) => !open && dismiss(message.id)}
            className={`rounded-md border px-4 py-3 shadow-lg ${message.variant === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-red-200 bg-red-50 text-red-900'}`}
          >
            <Toast.Title className="text-sm font-medium">{message.title}</Toast.Title>
            {message.description && <Toast.Description className="mt-1 text-sm opacity-80">{message.description}</Toast.Description>}
          </Toast.Root>
        ))}
        <Toast.Viewport className="fixed bottom-4 right-4 z-50 flex w-96 max-w-full flex-col gap-2 outline-none" />
      </Toast.Provider>
    </ToastContext.Provider>
  )
}
