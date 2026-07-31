import { type DefaultError, type QueryKey, type UseInfiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const createInfiniteQuery =
  <
    Options,
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    TPageParam = unknown,
    IsOptionsOptional extends boolean = Options extends void ? true : false,
  >(
    optionsFn: (options: Options) => UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>,
  ) =>
  (
    options: IsOptionsOptional extends true ? Options | void : Options,
    qOptions?: Omit<UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>, 'queryFn' | 'queryKey'>,
  ) =>
    useInfiniteQuery({ ...optionsFn(options as Options), ...qOptions })
