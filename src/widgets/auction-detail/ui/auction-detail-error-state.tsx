import type { ProblemDetail } from '@/shared/api'
import { Button } from '@/shared/ui/kit/button'

export function AuctionDetailErrorState({ error, onRetry, fallbackMessage }: { error: ProblemDetail | null; onRetry: () => void; fallbackMessage: string }) {
  const message = error && 'message' in error ? error.message : fallbackMessage

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 py-16 text-center">
      <p className="text-sm font-medium text-red-900">{message}</p>
      <Button className="mt-4" size="sm" variant="outline" onClick={onRetry}>
        Повторить
      </Button>
    </div>
  )
}
