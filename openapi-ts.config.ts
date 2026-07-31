import { defineConfig } from '@hey-api/openapi-ts'

// "page" is already covered by hey-api's default pagination keywords, and
// AuctionListRequest.page/per_page live in the POST body (not query params) —
// hey-api's pagination detector scans body schema properties too, so no
// custom parser.pagination.keywords needed here.
export default defineConfig({
  input: './openapi.auctions.v0.json',
  output: 'src/shared/api/generated',
  plugins: [
    { name: '@hey-api/client-fetch' },
    { name: '@hey-api/typescript', enums: 'javascript' },
    { name: '@hey-api/sdk' },
    {
      name: '@tanstack/react-query',
      infiniteQueryKeys: true,
      infiniteQueryOptions: true,
    },
  ],
})
