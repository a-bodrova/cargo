import { type DefaultError, type QueryKey, queryOptions } from '@tanstack/react-query'

import { queryClient } from '@/shared/lib/query-client'

export const invalidateQuery =
  <
    Options,
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    IsOptionsOptional extends boolean = Options extends void ? true : false,
  >(
    optionsFn: (options: Options) => ReturnType<typeof queryOptions<TQueryFnData, TError, TData, TQueryKey>>,
  ) =>
  (options: IsOptionsOptional extends true ? Options | void : Options) => {
    queryClient.invalidateQueries({
      queryKey: optionsFn(options as Options).queryKey,
    })
  }
