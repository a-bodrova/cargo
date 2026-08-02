import { Card, CardContent, CardHeader } from '@/shared/ui/kit/card'
import { Skeleton } from '@/shared/ui/kit/skeleton'

export function AuctionsListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2" aria-busy="true" aria-label="Загрузка списка аукционов">
      {Array.from({ length: count }, (_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="w-full space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-40" />
            </div>
            <Skeleton className="h-8 w-20" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
