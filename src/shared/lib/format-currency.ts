const formatter = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })

export function formatCurrency(value: number | null | undefined): string {
  return value == null ? '—' : formatter.format(value)
}
