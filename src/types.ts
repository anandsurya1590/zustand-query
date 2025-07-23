export type QueryState<T = unknown> = {
  data: T;
  error: Error;
  isLoading: boolean;
  isSuccess: boolean;
  updateAt?: number;
};

export type QueryOptions<T = unknown> = {
  queryKey: string;
  queryFn: () => Promise<T>;
  enabled?: boolean;
  staleTime?: number;
};

export type MutationOptions<TData, TVariables> = {
    mutationFn: (variables: TVariables) => Promise<TData>;
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
    onSettled?: () => void;
};