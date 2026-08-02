import { CITIES } from '@/shared/config/cities'
import { cn } from '@/shared/lib/cn'

interface CitySelectProps {
  label: string
  value: string | undefined
  onChange: (city: string | undefined) => void
}

/** Plain <select> — the city list is short and static, no need for a component-library dropdown. */
export function CitySelect({ label, value, onChange }: CitySelectProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-slate-700">{label}</span>
      <select
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value || undefined)}
        className={cn(
          'h-9 cursor-pointer rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        )}
      >
        <option value="">Любой</option>
        {CITIES.map((city) => (
          <option key={city.name} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
    </label>
  )
}
