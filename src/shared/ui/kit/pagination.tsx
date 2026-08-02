import { Button } from './button'

interface PaginationProps {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, lastPage, onPageChange }: PaginationProps) {
  if (lastPage <= 1) return null

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Пагинация">
      <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
        Назад
      </Button>
      <span className="text-sm text-slate-600">
        Страница {currentPage} из {lastPage}
      </span>
      <Button variant="outline" size="sm" disabled={currentPage >= lastPage} onClick={() => onPageChange(currentPage + 1)}>
        Далее
      </Button>
    </nav>
  )
}
