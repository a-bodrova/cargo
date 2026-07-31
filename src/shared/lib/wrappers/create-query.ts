import { type DefaultError, type QueryKey, queryOptions, useQuery } from '@tanstack/react-query'

export const createQuery =
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
  (
    options: IsOptionsOptional extends true ? Options | void : Options,
    qOptions?: Omit<Parameters<typeof queryOptions<TQueryFnData, TError, TData, TQueryKey>>[0], 'queryFn' | 'queryKey'>,
  ) =>
    useQuery({ ...optionsFn(options as Options), ...qOptions })
