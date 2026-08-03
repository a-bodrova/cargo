import { Card, CardContent, CardHeader } from '@/shared/ui/kit/card'
import { Skeleton } from '@/shared/ui/kit/skeleton'

export function AuctionDetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-6" aria-busy="true" aria-label="Загрузка данных аукциона">
      <Card>
        <CardHeader>
          <div className="w-full space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-64" />
          </div>
          <Skeleton className="h-10 w-36" />
        </CardHeader>
      </Card>
      {Array.from({ length: 3 }, (_, i) => (
        <Card key={i}>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
