import { defineConfig } from '@hey-api/openapi-ts'

// listAuctions is POST, and hey-api classifies POST as a mutation by default
// (only GET -> query out of the box) — without this override it never gets
// query options at all. See @hey-api/shared's defaultGetKind.
//
// Infinite queries (infiniteQueryKeys/infiniteQueryOptions) are deliberately
// left off: the assignment asks for classic page-number pagination, not
// infinite scroll, and page/per_page-based infinite loading has real
// downsides (duplicate/skipped rows on concurrent inserts, awkward "jump to
// page N"). The future external generator package still supports infinite
// queries as an opt-in — this project just doesn't turn it on.
export default defineConfig({
  input: './openapi.auctions.v0.json',
  output: 'src/shared/api/generated',
  parser: {
    hooks: {
      operations: {
        isQuery: (operation) => (operation.operationId === 'listAuctions' ? true : undefined),
      },
    },
  },
  plugins: [
    { name: '@hey-api/client-fetch' },
    { name: '@hey-api/typescript', enums: 'javascript' },
    { name: '@hey-api/sdk' },
    { name: '@tanstack/react-query', infiniteQueryKeys: false, infiniteQueryOptions: false },
  ],
})
