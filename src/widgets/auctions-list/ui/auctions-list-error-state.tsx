import type { ProblemDetail, ValidationProblem } from '@/shared/api'
import { Button } from '@/shared/ui/kit/button'

export function AuctionsListErrorState({ error, onRetry }: { error: ProblemDetail | ValidationProblem | Error | null; onRetry: () => void }) {
  const message = error && 'message' in error ? error.message : 'Не удалось загрузить список аукционов.'

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 py-16 text-center">
      <p className="text-sm font-medium text-red-900">{message}</p>
      <Button className="mt-4" size="sm" variant="outline" onClick={onRetry}>
        Повторить
      </Button>
    </div>
  )
}
