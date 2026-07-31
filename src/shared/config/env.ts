/**
 * Defaults to enabled so MSW keeps serving data after `npm run build && npm
 * run preview` too, not just `npm run dev` — there's no real backend behind
 * this app. Set VITE_ENABLE_MSW=false to turn it off (e.g. once pointed at
 * a real API).
 */
export const ENABLE_MSW = import.meta.env.VITE_ENABLE_MSW !== 'false'
