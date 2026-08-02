export function AuctionsListEmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 py-16 text-center">
      <p className="text-sm font-medium text-slate-700">Ничего не найдено</p>
      <p className="mt-1 text-sm text-slate-500">Попробуйте изменить фильтры или сбросить их.</p>
    </div>
  )
}
