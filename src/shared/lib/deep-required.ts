/**
 * Almost nothing in openapi.auctions.v0.json is marked `required` at any
 * nesting level, so hey-api generates every field as optional even though
 * our only real data source (the MSW mock) always populates them fully.
 * Cast a DTO through this once at the top of a mapper instead of asserting
 * `!` on every leaf field.
 */
export type DeepRequired<T> = T extends (infer U)[] ? DeepRequired<U>[] : T extends object ? { [K in keyof T]-?: DeepRequired<T[K]> } : T
