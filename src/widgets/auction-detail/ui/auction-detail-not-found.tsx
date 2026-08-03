import { Link } from '@tanstack/react-router'

export function AuctionDetailNotFound() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="rounded-lg border border-dashed border-slate-300 py-16 text-center">
        <p className="text-sm font-medium text-slate-700">Аукцион не найден</p>
        <Link to="/auctions" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
          Вернуться к списку аукционов
        </Link>
      </div>
    </div>
  )
}
