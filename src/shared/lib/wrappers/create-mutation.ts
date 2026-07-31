import { useMutation, type UseMutationOptions } from '@tanstack/react-query'

export const createMutation =
  <Options, Response, ErrorType = Error>(mutationFn: (options?: Options) => UseMutationOptions<Response, ErrorType, Options>) =>
  (
    options?: Options & {
      onSuccess?: (data: Response) => void
      onError?: (error: ErrorType) => void
    },
  ) => {
    return useMutation({
      ...mutationFn(options as Options),
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    })
  }
