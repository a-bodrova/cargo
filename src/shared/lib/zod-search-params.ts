import { z } from 'zod'

/**
 * Router search params round-trip through the URL as strings (and single
 * values vs. repeated keys are ambiguous), so raw arrays can't be trusted —
 * a lone value must be normalized into a single-item array before z.array()
 * sees it. (Booleans don't need this: z.coerce.boolean() already handles
 * both the raw JS boolean navigate() passes and the "true"/"false" string
 * that comes back from a parsed URL.)
 */
export function arraySearchParam<T extends z.ZodTypeAny>(item: T) {
  return z.preprocess((value) => (value === undefined ? value : Array.isArray(value) ? value : [value]), z.array(item))
}
