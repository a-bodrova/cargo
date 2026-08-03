import type { ReactNode } from 'react'

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-xs text-slate-400">{label}</div>
      <div>{children}</div>
    </div>
  )
}
